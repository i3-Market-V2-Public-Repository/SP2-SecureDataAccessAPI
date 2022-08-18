import { NextFunction, Request, Response } from 'express'
import * as nonRepudiationLibrary from '@i3m/non-repudiation-library'
import npsession from '../session/np.session'

const poo = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const privateJwks = await nonRepudiationLibrary.generateKeys('ES256')
        const publicJwk = JSON.stringify(privateJwks.publicJwk)
        /**
         * Using the Smart Contract Manager / Secure Data Access, a consumer and a provider would have agreed a Data Exchange Agreement
         */
        const dataExchangeAgreement: nonRepudiationLibrary.DataExchangeAgreement = {
          // Public key of the origin (data provider) for verifying the proofs she/he issues. It should be providerJwks.publicJwk
          orig: `${publicJwk}`,
          // Public key of the destination (data consumer)
          dest: `${publicJwk}`,
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

        // Let us define the RPC endopint to the ledger (just in case we don't want to use the default one)
        const dltConfig: Partial<nonRepudiationLibrary.DltConfig> = {
        rpcProviderUrl: 'http://95.211.3.244:8545'
        }
      
        // We are going to directly provide the private key associated to the dataExchange.ledgerSignerAddress. You could also have pass a DltSigner instance to dltConfig.signer in order to use an externam Wallet, such as the i3-MARKET one
        const providerDltSigningKeyHex = '0x4b7903c8fe18e4ba5329939c7d1c4318307794a544f3eb5fb3b6536210c98676'

        const block = '{msg:"test"}'
        let buf = Buffer.from(block)

        const npProvider = new nonRepudiationLibrary.NonRepudiationProtocol.NonRepudiationOrig(dataExchangeAgreement, privateJwks.privateJwk, buf, providerDltSigningKeyHex)
        npsession.set("3412fwe1df", npProvider)
        const poo = await npProvider.generatePoO()
        const nrp_block = npProvider.block.jwe

        const response = {
            poo : poo.jws,
            block: nrp_block
        }
        res.send(response)
    } catch (error) {
        next(error)   
    }
}

const por = (req: Request, res: Response, next: NextFunction) => {
    try {
        const npProvider:nonRepudiationLibrary.NonRepudiationProtocol.NonRepudiationOrig = npsession.get("3412fwe1df")
        console.log(npProvider.block)
        res.send("Hello world!")
    } catch (error) {
        next(error)   
    }
}

export { poo, por }