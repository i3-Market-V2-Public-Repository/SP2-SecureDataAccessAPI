import * as path from 'path';

const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const port = 3000

export const env = {
    blockSize: Number(process.env.BLOCK_SIZE) ?? 256,
    addr: String(process.env.ADDR),
    port: Number(process.env.PORT) ?? port,
    publicUri: String(process.env.PUBLIC_URI) ?? `http://localhost:${port}`,
    tokenizerUrl: String(process.env.TOKENIZER_URL) ??  'http://95.211.3.249:3001',
    backplaneUrl: String(process.env.BACKPLANE_URL) ?? 'http://95.211.3.244:3000',
    smartContractManager: String(process.env.SMART_CONTRACT_MANAGER) ?? 'http://95.211.3.249:3333',
    filename: String(process.env.DATABASE_PATH) ?? './tmp/dataAccessDatabase.db3',
    dataSpaceUser: String(process.env.DATA_SPACE_USER) ?? 'admin',
    dataSpacePassword: String(process.env.DATA_SPACE_PASSWORD) ?? 'admin',
    rpcProviderUrl: String(process.env.RPC_PROVIDER_URL) ?? 'http://95.211.3.244:8545',
    providerDltSigningKeyHex: String(process.env.PROVIDER_DLT_SIGNING_KEY_HEX) ?? '0x4b7903c8fe18e4ba5329939c7d1c4318307794a544f3eb5fb3b6536210c98676',
    storagePassword: String(process.env.STORAGE_PASSWORD) ?? 'provider',
    storagePath: String(process.env.STORAGE_PATH) ?? './config/wallet',
    providerDid: String(process.env.PROVIDER_DID) ?? 'did:ethr:i3m:0x02bfe73464de64d6d9a32c99a92356e641ff16427a59b20a95e8d348a60145259a'
}