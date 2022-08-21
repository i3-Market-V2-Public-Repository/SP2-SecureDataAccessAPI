import * as path from 'path'

const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const port = 3000

export const env = {
    addr: String(process.env.ADDR),
    port: Number(process.env.PORT) ?? port,
    publicUri: String(process.env.PUBLIC_URI) ?? `http://localhost:${port}`,
    filename: String(process.env.DATABASE_PATH) ?? './tmp/dataAccessDatabase.db3',
    dataSpaceUser: String(process.env.DATA_SPACE_USER) ?? 'admin',
    dataSpacePassword: String(process.env.DATA_SPACE_PASSWORD) ?? 'admin'
}