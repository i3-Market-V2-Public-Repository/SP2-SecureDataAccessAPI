import { Request, NextFunction, Response } from 'express';
import { getTimestamp } from '../common/common';
import { openDb } from '../sqlite/sqlite';

export async function registerDataSource(req: Request, res: Response, next: NextFunction) {

    try {
        const uid = req.body.uid
        const description = req.body.description
        const url = req.body.url
        const action = req.body.action

        const timestamp = getTimestamp()

        const db = await openDb()

        const insert = 'INSERT INTO DataSources(Uid, Description, Url, Timestamp) VALUES (?, ?)'
        const select = 'SELECT * FROM DataSources WHERE Uid=?'
        const unregister = 'DELETE FROM DataSources WHERE Uid=?'

        const selectParams = [uid]
        const deregisterParams = [uid]
        const insertParams = [uid, description, url, timestamp]

        if (action === 'register') {

            const selectResult = await db.get(select, selectParams)

            if (selectResult !== undefined) {
                await db.run(insert, insertParams)
                await db.close()

                res.status(200).send('OK')
            } else {
                res.send({ msg: `Data source with uid ${uid} already registered` })
            }

        }
        if (action === 'unregister') {
            await db.run(unregister, deregisterParams)

            res.status(200).send('OK')
        }
    } catch (error) {
        next(error)
    }
}

export async function newData(req: Request, res: Response, next: NextFunction) {
    try {
        const data = req.body
        const uid = req.params.uid
    
        const db = sqliteFunctions.connectToDatabase('./db/data_access_server.db3')
        const client = client_subscription.mqttinit()
    
        let rawBufferData = Buffer.from(data)
        let data_sent = rawBufferData.length
        npProvider = new nonRepudiationLibrary.NonRepudiationProtocol.NonRepudiationOrig(dataExchangeAgreement, privateJwk, data, providerDltSigningKeyHex)
        const poo = await npProvider.generatePoO()
        
        const response_data = {block_id: block_id, cipherblock: npProvider.block.jwe, poO: poo}
        block_id = block_id + 1
        let sql = 'SELECT * FROM consumer_subscribers WHERE DataSourceUid=?'
        db.serialize(function(){
          db.all(sql, [uid], (err, rows) => {
              if (err) {
               console.log(err);
              }       
              rows.forEach(function(item){
                  client.publish('/to/'+item.ConsumerDid+'/'+item.DataSourceUid, JSON.stringify(response_data))
                const ammount_of_data_received = Number(item.AmmountOfDataReceived) + data_sent
                const sub_id = item.SubId
                sqliteFunctions.saveAmmountOfDataSent(ammount_of_data_received, sub_id, db)
              })
          });
        })
        res.status(200).send({ msg: 'Data sent to broker' })
    
      } catch (error) {
            next(error)
      }
}