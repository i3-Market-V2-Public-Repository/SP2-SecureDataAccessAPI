import { serverWalletBuilder, ServerWallet } from '@i3m/server-wallet';
import { env } from './env';

class ProviderOperatorWallet {

    #providerOperatorWallet: ServerWallet | undefined
    #providerDid: string | undefined
    
    public async init() {
        this.#providerOperatorWallet = await serverWalletBuilder({ password: env.storagePassword, reset: false, filepath: env.storagePath })
        await this.#providerOperatorWallet.importDid({
            alias: 'provider',
            privateKey: env.providerDltSigningKeyHex
        })
        const availableIdentities = await this.#providerOperatorWallet.identityList({ alias: 'provider' })
        
        // The provider DID
        this.#providerDid = availableIdentities[0].did
        console.log('Connected to the provider Server Wallet')
    }

    getProviderOperatorWallet() {
        return this.#providerOperatorWallet
    }

    getProviderDid() {
        return this.#providerDid
    }
}

let providerWallet = new ProviderOperatorWallet()

export default providerWallet