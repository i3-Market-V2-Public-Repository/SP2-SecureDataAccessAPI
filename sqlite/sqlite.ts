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

    const tables: string[] = ['CREATE TABLE IF NOT EXISTS DataSpaceUsers(User TEXT, Password TEXT);',
                              'CREATE TABLE IF NOT EXISTS ConsumerSubscribers(ConsumerDid TEXT, DataSourceUid TEXT, Timestamp TEXT, SubId TEXT, AmmountOfDataReceived TEXT, PRIMARY KEY (ConsumerDid, DataSourceUid));',
                              'CREATE TABLE IF NOT EXISTS DataSources(Uid TEXT PRIMARY KEY, Description TEXT, Url TEXT, Timestamp TEXT);',
                              'CREATE TABLE IF NOT EXISTS Accounting(Date INTEGER, ConsumerId TEXT, ExchangeId TEXT, AgreementId TEXT, Poo TEXT, Por TEXT, Pop TEXT PRIMARY KEY);'
    ];
    
    tables.forEach(query => {
        db.exec(query)
    });

}

//await db.run('INSERT INTO DataSpaceUsers(User, Password) VALUES (?, ?)', [env.dataSpaceUser, env.dataSpacePassword])
//'SELECT * FROM DataSpaceUsers WHERE User=? AND Password=?', env.dataSpaceUser, env.dataSpacePassword
export async function insertIntoTb(insert: string, select: string = 'undefined', params: string[], db: Database<sqlite3.Database, sqlite3.Statement>){

    if (select != 'undefined') {

        const result = await db.all(select, params)

        if (result.length === 0){
            await db.run(insert, params)
        }
    }
}