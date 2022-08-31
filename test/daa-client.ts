import * as nonRepudiationLibrary from '@i3m/non-repudiation-library'
import 'isomorphic-fetch'
import { env } from '../config/env'

const nrp = async() => {

    const privateJwk:nonRepudiationLibrary.JWK = {
        kty: 'EC',
        crv: 'P-256',
        x: '342tToZrvj64K-0vPuq9B5t8Bx3kjOlVW574Q2vo-zY',
        y: 'KtukEk-5ZSvJznoWYl99l6x8CbxbMDYJ7fBbwU8Dnpk',
        d: 'bF0ufFC_AHEY98HIZnqLdIMp1Hnh-8Y2sglQ15GOp7k',
        alg: 'ES256'
      }
    
      const publicJwk:nonRepudiationLibrary.JWK = {
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

      const bearerToken = "bearer toBeModified"
      const signature = "toBeModified"

      const agreementId = 1
      const data = "example.7z"
      const blockId = "74234e98afe7498fb5daf1f36ac2d78acc339464f950703b8c019892f982b90b"
      const blockAck = "74234e98afe7498fb5daf1f36ac2d78acc339464f950703b8c019892f982b90b"
      
      const content = await requestData(data, agreementId, signature, bearerToken, blockId, blockAck)

      if (content.poo != 'null') {
        const poo = content.poo

            const npConsumer = new nonRepudiationLibrary.NonRepudiationProtocol.NonRepudiationDest(dataExchangeAgreement, privateJwk)

            await npConsumer.verifyPoO(poo, content.cipherBlock)
            console.log('The poo is valid')

            const por = await npConsumer.generatePoR()
            console.log("The por is: "+JSON.stringify(por))

            let pop = await requestPop(bearerToken, por)
            console.log("The pop is: "+JSON.stringify(pop))

            await npConsumer.verifyPoP(pop.jws)

            const decryptedBlock = await npConsumer.decrypt()
            console.log(decryptedBlock)

    } 
}

nrp()


// Helper functions
async function requestPop (bearerToken: string, por: nonRepudiationLibrary.StoredProof<nonRepudiationLibrary.PoRPayload>) {
    const sendPor = await fetch(`${env.publicUri}/batch/pop`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            //'Authorization': `${bearerToken}`,
        },
        body: JSON.stringify({por: por.jws}),
    })
    const pop: Pop = await sendPor.json()
    console.log(JSON.stringify(pop))
    return pop
}


async function requestData (data: string, agreementId: number, signature: string, bearerToken: string, blockId: string, blockAck: string) {
    const resource = await fetch(`${env.publicUri}/` + `batch/${data}/${agreementId}/${signature}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            //'Authorization': `${bearerToken}`,
        },
        body: JSON.stringify({ blockId: blockId, blockAck: blockAck }),
    })
    const content: Content = await resource.json()
    console.log(content.poo)
    return content
}

// Interfaces
interface Content {
    poo: string,
    cipherBlock: string
}

interface Pop {
    jws: string;
    payload: object;
}