import * as nonRepudiationLibrary from '@i3m/non-repudiation-library';
import * as fs from 'fs';
import { env } from '../config/env';
import 'isomorphic-fetch';
import { HttpInitiatorTransport, Session } from '@i3m/wallet-protocol'
import { WalletApi } from '@i3m/wallet-protocol-api'

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
    pooToPorDelay: 100000,
    // Maximum acceptable delay between the issuance of the proof of origing (PoP) by the orig and the reception of the proof of publication (PoR) by the dest
    pooToPopDelay: 30000,
    // If the dest (data consumer) does not receive the PoP, it could still get the decryption secret from the DLT. This defines the maximum acceptable delay between the issuance of the proof of origing (PoP) by the orig and the publication (block time) of the secret on the blockchain.
    pooToSecretDelay: 180000
}

const dltConfig: Partial<nonRepudiationLibrary.DltConfig> = {
    rpcProviderUrl: 'http://95.211.3.244:8545'
}

const bearerToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIwLjAuMC4wIiwiYXVkIjoiMC4wLjAuMCIsImV4cCI6MTY2ODY5MDcyNiwic3ViIjoiZGlkOmV0aHI6aTNtOjB4MDNlZGRjYzU0YmZiZGNlNGZiZDU5OGY0ODI3MzUxZmViMjMxMGQwMDVmYjFkNTMxNDVlNjc4N2QwYTZmN2IwZjVmIiwic2NvcGUiOiJvcGVuaWQgdmMgdmNlOmNvbnN1bWVyIiwiaWF0IjoxNjY4NjA0MzI2fQ.xnGXN3H754Hz1Y7bdJgmxTxSY59imspJLDmTwq6VUkQ"

const agreementId = 12
const data = "exampledata.7z"
let blockId = "null"
let blockAck = "null"

const oneBlock = async () => {

    const content = await requestData(data, agreementId, bearerToken, blockId, blockAck)

    const sessionObj = JSON.parse('{"masterKey":{"from":{"name":"Initiator"},"to":{"name":"Wallet desktop"},"port":29170,"na":"bto0GtBh9KjvG8PRRySTGQ","nb":"Q1oHivusP5DuV0hXhe8IdA","secret":"3AiI59_DJZNbgLFy0W4EUc7srnsOwSidlWp8ayzyP78"},"code":"65794a68624763694f694a6b615849694c434a6c626d4d694f694a424d6a553252304e4e496e302e2e68717036594c42372d654f786857724e2e762d3032305f752d684a625f664b776e74754e774c6f304f4742735a35536a6f2d4d4e422d6e62776d6558554d56515a54684b434f36327a4e5151636f5738634a42693850634437525a316c5231496b37776b4634366a586f7a785a4633597432387a546452656b45574d706a6c444351565061544f4a67434c5a6561544b5875784a6f756c7050686b5a794536385f7a582d6e37626c2d68564732706a635a4e69587a704730616a654e4a7961754f464a6a70657a696a45646764764f767a5f453167646a486e64697862716273307a6b597478753649735f654f675f705876466b4279784d326b6b64595468355a4f586573363831706f74775062376c6f4d7662615f465076545f38566d50724f63535441566a52556c432d6341745f5171677147616338776f4a37626a4e6a792d5471665f6142666b324d78337932713355676371567159332d776230683571484b553636583336706c39706f6b486b4368576b31654276436a4d4e41523671487a596c30667537626a4c4b43772e73756e4c776e6e33437648775438612d324b4c364841"}')
    
    // Setup consumer wallet
    const transport = new HttpInitiatorTransport()
    const session = await Session.fromJSON(transport, sessionObj)
    let consumerWallet = new WalletApi(session)

    const consumerDid = 'did:ethr:i3m:0x037e1117d84099a5763f763960f993956dc17aacd2af06cd8a236584a547ec3fe3'
    
    if (content.poo != 'null') {
        const poo = content.poo

        const npConsumer = new nonRepudiationLibrary.NonRepudiationProtocol.NonRepudiationDest(dataExchangeAgreement, privateJwk)

        await npConsumer.verifyPoO(poo, content.cipherBlock)
        console.log('The poo is valid')

        const por = await npConsumer.generatePoR()
        console.log("The por is: " + JSON.stringify(por))

        let pop = await requestPop(bearerToken, por)
        console.log("The pop is: " + JSON.stringify(pop))

        await npConsumer.verifyPoP(pop.jws)

        const decryptedBlock = await npConsumer.decrypt()
        console.log(decryptedBlock)

    }
}

oneBlock()


const oneFile = async () => {

    let check_eof = true

    let stream = fs.createWriteStream(`./${data}`, { flags: 'a' })

    while (check_eof) {

        let content = await requestData(data, agreementId, bearerToken, blockId, blockAck)

        console.log(content)

        if (content.poo != 'null') {

            const poo = content.poo

            const npConsumer = new nonRepudiationLibrary.NonRepudiationProtocol.NonRepudiationDest(dataExchangeAgreement, privateJwk)

            await npConsumer.verifyPoO(poo, content.cipherBlock)
            console.log('The poo is valid')

            const por = await npConsumer.generatePoR()
            console.log("The por is: " + JSON.stringify(por))

            let pop = await requestPop(bearerToken, por)
            console.log("The pop is: " + JSON.stringify(pop))

            await npConsumer.verifyPoP(pop.pop)

            const decryptedBlock = await npConsumer.decrypt()
            console.log(decryptedBlock)

            stream.write(decryptedBlock)
        }
        blockId = content.nextBlockId
        blockAck = content.blockId

        if (content.nextBlockId == "null" && blockAck == "null") {
            check_eof = false
            stream.end()
            console.log("File imported")
        }
    }
}

oneFile()

// Helper functions
async function requestPop(bearerToken: string, por: nonRepudiationLibrary.StoredProof<nonRepudiationLibrary.PoRPayload>) {
    const sendPor = await fetch(`${env.publicUri}/batch/pop`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({ por: por.jws }),
    })
    const pop = await sendPor.json()
    console.log(JSON.stringify(pop))
    return pop
}

async function requestData(data: string, agreementId: number, bearerToken: string, blockId: string, blockAck: string) {
    const resource = await fetch(`${env.publicUri}/` + `batch/${data}/${agreementId}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({ blockId: blockId, blockAck: blockAck }),
    })
    const content: Content = await resource.json()
    console.log(content.poo)
    return content
}

// Interfaces
interface Content {
    blockId: string,
    nextBlockId: string,
    poo: string,
    cipherBlock: string,
    transactionObject?: object
}

// interface Pop {
//     jws: string;
//     payload: object;
// }