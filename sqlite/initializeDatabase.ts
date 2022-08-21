import { openDb, createTables, insertIntoTb, verifyIfTbRowsExist } from "./sqlite";
import { env } from '../config/env'

export async function initializeDb() {
    

    const insert = 'INSERT INTO DataSpaceUsers(User, Password) VALUES (?, ?)'
    const select = 'SELECT * FROM DataSpaceUsers WHERE User=? AND Password=?'
    const params = [env.dataSpaceUser, env.dataSpacePassword]

    const db = await openDb()
    await createTables(db)
    const verify = await verifyIfTbRowsExist(select, params, db)
    await insertIntoTb(verify, insert, params, db)
    await db.close()
}