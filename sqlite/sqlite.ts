import * as sqlite3  from 'sqlite3';
import { Database, open } from 'sqlite'
import { env } from '../config/env'

//const DigestFetch = require('digest-fetch');


export async function openDb() {
    const db = await open({
      filename: env.filename,
      driver: sqlite3.Database
    });
    return db
  }

export async function createTables(db: Database<sqlite3.Database, sqlite3.Statement>) {

    const tables: string[] = ['CREATE TABLE IF NOT EXISTS DataSpaceUsers(User TEXT PRIMARY KEY, Password TEXT);',
                              'CREATE TABLE IF NOT EXISTS ConsumerSubscribers(ConsumerDid TEXT, DataSourceUid TEXT, Timestamp TEXT, SubId TEXT, AmmountOfDataReceived TEXT, PRIMARY KEY (ConsumerDid, DataSourceUid));',
                              'CREATE TABLE IF NOT EXISTS DataSources(Uid TEXT PRIMARY KEY, Description TEXT, Url TEXT, Timestamp TEXT);',
                              'CREATE TABLE IF NOT EXISTS Accounting(Date INTEGER, ConsumerId TEXT, ExchangeId TEXT, AgreementId TEXT, Poo TEXT, Por TEXT, Pop TEXT PRIMARY KEY, VerificationRequest TEXT);',
                              'CREATE TABLE IF NOT EXISTS DataExchangeAgreements(ConsumerPublicKey TEXT, ProviderPublicKey TEXT, ProviderPrivateKey TEXT, DataExchangeAgreement TEXT);',
    ];
    
    tables.forEach(query => {
        db.exec(query)
    });

}

export async function findByUsername (username: string, cb: (error: any, user?: any, password?: any) => void) {

    const db = await openDb()

    const select = 'SELECT * FROM DataSpaceUsers WHERE User= ?'
    const params = [username]

    const selectResult = await db.get(select, params)
    
    await db.close()

    process.nextTick(function() {
        if (selectResult != undefined){
            return cb(null, selectResult)
        } else {
            return cb(null,null)
        }
    })
}

//await db.run('INSERT INTO DataSpaceUsers(User, Password) VALUES (?, ?)', [env.dataSpaceUser, env.dataSpacePassword])
//'SELECT * FROM DataSpaceUsers WHERE User=? AND Password=?', env.dataSpaceUser, env.dataSpacePassword

// export async function insertIntoTb(exists: boolean, insert: string, params: any [], db: Database<sqlite3.Database, sqlite3.Statement>){

//     if(!exists) {
//         await db.run(insert, params)
//     }
// }

// export async function verifyIfTbRowsExist(select: string, params: string[], db: Database<sqlite3.Database, sqlite3.Statement>) {

//     const result = await db.all(select, params)

//     if (result.length === 0){
//         return false
//     } else {
//         return true
//     }
// }

// export async function getFromTb(select: string, params: string[], db: Database<sqlite3.Database, sqlite3.Statement>) {
    
//     const result = await db.get(select, params)

//     return result
// }