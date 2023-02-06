import * as path from 'path';

const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const port = 3000

export const env = {
    blockSize: Number(process.env.BLOCK_SIZE) ?? 256,
    addr: String(process.env.ADDR),
    port: Number(process.env.PORT) ?? port,
    publicUri: String(process.env.PUBLIC_URI) ?? `http://localhost:${port}`,
    tokenizerUrl: String(process.env.TOKENIZER_URL) ??  '',
    backplaneUrl: String(process.env.BACKPLANE_URL) ?? '',
    smartContractManager: String(process.env.SMART_CONTRACT_MANAGER) ?? '',
    filename: String(process.env.DATABASE_PATH) ?? './tmp/dataAccessDatabase.db3',
    dataSpaceUser: String(process.env.DATA_SPACE_USER) ?? 'admin',
    dataSpacePassword: String(process.env.DATA_SPACE_PASSWORD) ?? 'admin',
    rpcProviderUrl: String(process.env.RPC_PROVIDER_URL) ?? '',
    providerDltSigningKeyHex: String(process.env.PROVIDER_DLT_SIGNING_KEY_HEX) ?? '',
    storagePassword: String(process.env.STORAGE_PASSWORD) ?? 'provider',
    storagePath: String(process.env.STORAGE_PATH) ?? './config/wallet'
}