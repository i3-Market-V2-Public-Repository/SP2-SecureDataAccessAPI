import { serverWalletBuilder, ServerWallet } from '@i3m/server-wallet';
import * as nonRepudiationLibrary from '@i3m/non-repudiation-library'
import { env } from '../config/env';

export default async (): Promise<ServerWallet> => {

    // Setup provider wallet
    const providerWallet = await serverWalletBuilder({ password: env.storagePassword, reset: true, filepath: env.storagePath })

    // Import DLT account
    await providerWallet.importDid({
    alias: 'provider',
    privateKey: env.providerDltSigningKeyHex
   })
   const availableIdentities = await providerWallet.identityList({ alias: 'provider' })
   
   // The provider DID
   const providerDid = availableIdentities[0]
   console.log(providerDid)
   // The provider address on the DLT
   const providerDltAddress = nonRepudiationLibrary.getDltAddress(env.providerDltSigningKeyHex)

   return providerWallet
}