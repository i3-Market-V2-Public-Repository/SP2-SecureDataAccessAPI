import { openDb, createTables } from "./sqlite";
import { env } from '../config/env';

export async function initializeDb() {
    

    const insert = 'INSERT INTO DataSpaceUsers(User, Password) VALUES (?, ?)'
    const select = 'SELECT * FROM DataSpaceUsers WHERE User=? AND Password=?'
    const params = [env.dataSpaceUser, env.dataSpacePassword]

    const db = await openDb()
    await createTables(db)
    const selectResult = await db.all(select, params)

    if (selectResult.length === 0) {    
        await db.run(insert, params)
    }
    
    await db.close()
}