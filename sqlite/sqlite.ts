import { Database, open } from 'sqlite';
import { env } from '../config/env';
import * as sqlite3  from 'sqlite3';

export async function openDb() {
    const db = await open({
      filename: env.filename,
      driver: sqlite3.Database
    });
    return db
  }

export async function createTables(db: Database<sqlite3.Database, sqlite3.Statement>) {

    const tables: string[] = ['CREATE TABLE IF NOT EXISTS DataSpaceUsers(User TEXT PRIMARY KEY, Password TEXT);',
                              'CREATE TABLE IF NOT EXISTS StreamSubscribers(ConsumerDid TEXT, OfferingId TEXT, AgreementId TEXT, Timestamp TEXT, SubId TEXT, AmmountOfDataReceived TEXT, PRIMARY KEY (ConsumerDid, OfferingId));',
                              'CREATE TABLE IF NOT EXISTS DataSources(OfferingId TEXT PRIMARY KEY, Description TEXT, Url TEXT, Timestamp TEXT);',
                              'CREATE TABLE IF NOT EXISTS Accounting(Date INTEGER, ConsumerId TEXT, ExchangeId TEXT, AgreementId INTEGER, Poo TEXT, Por TEXT, Pop TEXT PRIMARY KEY, VerificationRequest TEXT, Mode TEXT);',
                              'CREATE TABLE IF NOT EXISTS DataExchangeAgreements(AgreementId INTEGER PRIMARY KEY, ConsumerPublicKey TEXT, ProviderPublicKey TEXT, ProviderPrivateKey TEXT, DataExchangeAgreement TEXT);',
                              'CREATE TABLE IF NOT EXISTS MarketFeePayments(AgreementId INTEGER PRIMARY KEY, ConsumerDid TEXT, Payment TEXT);',
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