import { StreamResponse } from '../types/openapi';
import * as nonRepudiationLibrary from '@i3m/non-repudiation-library';
import * as mqtt from 'mqtt';
import * as fs from 'fs';
import jwtDecode, { JwtPayload } from "jwt-decode";

const privateJwk: nonRepudiationLibrary.JWK = {
    kty: 'EC',
    crv: 'P-256',
    x: '342tToZrvj64K-0vPuq9B5t8Bx3kjOlVW574Q2vo-zY',
    y: 'KtukEk-5ZSvJznoWYl99l6x8CbxbMDYJ7fBbwU8Dnpk',
    d: 'bF0ufFC_AHEY98HIZnqLdIMp1Hnh-8Y2sglQ15GOp7k',
    alg: 'ES256'
}

const publicJwk: nonRepudiationLibrary.JWK = {
    kty: 'EC',
    crv: 'P-256',
    x: '342tToZrvj64K-0vPuq9B5t8Bx3kjOlVW574Q2vo-zY',
    y: 'KtukEk-5ZSvJznoWYl99l6x8CbxbMDYJ7fBbwU8Dnpk',
    alg: 'ES256'
}

const dataExchangeAgreement: nonRepudiationLibrary.DataExchangeAgreement = {
    // Public key of the origin (data provider) for verifying the proofs she/he issues. It should be providerJwks.publicJwk
    orig: JSON.stringify(publicJwk),
    // Public key of the destination (data consumer)
    dest: JSON.stringify(publicJwk),
    // Encryption algorithm used to encrypt blocks. Either AES-128-GCM ('A128GCM') or AES-256-GCM ('A256GCM)
    encAlg: 'A256GCM',
    // Signing algorithm used to sign the proofs. It'e ECDSA secp256r1 with key lengths: either 'ES256', 'ES384', or 'ES512' 
    signingAlg: 'ES256',
    // Hash algorith used to compute digest/commitments. It's SHA2 with different output lengths: either 'SHA-256', 'SHA-384' or 'SHA-512'
    hashAlg: 'SHA-256',
    // The ledger smart contract address (hexadecimal) on the DLT
    ledgerContractAddress: '0x8d407a1722633bdd1dcf221474be7a44c05d7c2f',
    // The orig (data provider) address in the DLT (hexadecimal).
    ledgerSignerAddress: '0x17bd12C2134AfC1f6E9302a532eFE30C19B9E903',
    // Maximum acceptable delay between the issuance of the proof of origing (PoO) by the orig and the reception of the proof of reception (PoR) by the orig
    pooToPorDelay: 10000,
    // Maximum acceptable delay between the issuance of the proof of origing (PoP) by the orig and the reception of the proof of publication (PoR) by the dest
    pooToPopDelay: 20000,
    // If the dest (data consumer) does not receive the PoP, it could still get the decryption secret from the DLT. This defines the maximum acceptable delay between the issuance of the proof of origing (PoP) by the orig and the publication (block time) of the secret on the blockchain.
    pooToSecretDelay: 150000
}

const dltConfig: Partial<nonRepudiationLibrary.DltConfig> = {
    rpcProviderUrl: 'http://95.211.3.244:8545'
}

const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIwLjAuMC4wIiwiYXVkIjoiMC4wLjAuMCIsImV4cCI6MTY2MzU5MDQ1MCwic3ViIjoiZGlkOmV0aHI6aTNtOjB4MDNlZGRjYzU0YmZiZGNlNGZiZDU5OGY0ODI3MzUxZmViMjMxMGQwMDVmYjFkNTMxNDVlNjc4N2QwYTZmN2IwZjVmIiwic2NvcGUiOiJvcGVuaWQgdmMgdmNlOmNvbnN1bWVyIiwiaWF0IjoxNjYzNTA0MDUwfQ.6HC6fDLVnJWMBqwmUPuu0WirMYmyApIgf_H5nqWHMa4'
const dataSourceUid = '123abc'
const agreementId = 1

async function streamSubscribe() {
    try {

        const npConsumer = new nonRepudiationLibrary.NonRepudiationProtocol.NonRepudiationDest(dataExchangeAgreement, privateJwk)

        const decoded = jwtDecode<JwtPayload>(bearerToken!)
        const consumerId = decoded.sub

        const options = {
            username: `${bearerToken}`, 
            password: 'something', 
            clientId: `${consumerId}`,
            clean: false
        };
    
        let mqtt_client = mqtt.connect('mqtt://localhost:1884', options)

        mqtt_client.on('connect', function () {
            mqtt_client.subscribe(`/to/${consumerId}/${dataSourceUid}/${agreementId}`)
        });

        mqtt_client.on('message', async(topic, message) => {

            console.log(topic + " " + message.toString())

            if(message.toString().startsWith('{"jws"')){

                const pop: nonRepudiationLibrary.StoredProof<nonRepudiationLibrary.PoOPayload> = JSON.parse(message.toString())
                await npConsumer.verifyPoP(pop.jws)

                const fileName = pop.payload.exchange.cipherblockDgst

                const decryptedBlock = await npConsumer.decrypt()

                console.log(decryptedBlock)
                console.log(String(decryptedBlock))

                const stream = fs.createWriteStream(`./${fileName}.json`, { flags: 'a' })

                stream.write(String(decryptedBlock))
                stream.end()

            } else {
                const content: StreamResponse = JSON.parse(message.toString())

                await npConsumer.verifyPoO(content.poo, content.cipherBlock)

                const por = await npConsumer.generatePoR()
                mqtt_client.publish(`/from/${consumerId}/${dataSourceUid}/${agreementId}`, JSON.stringify(por.jws))
            }
          })
        console.log(`Mqtt client with id ${consumerId} subscribed to datasource ${dataSourceUid}`)

    } catch (error) {
        if(error instanceof Error){
            console.log(`${error.message}`)
        }
    }
}

streamSubscribe()