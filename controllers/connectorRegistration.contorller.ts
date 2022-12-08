import * as nonRepudiationLibrary from '@i3m/non-repudiation-library';
import { Request, NextFunction, Response } from 'express';
import { getAgreement, getAgreementState, getTimestamp } from '../common/common';
import { openDb } from '../sqlite/sqlite';
import { Mode, StreamResponse, StreamSubscribersRow } from '../types/openapi';
import { env } from '../config/env';
import mqttinit from '../mqtt/mqttInit';
import npsession from '../session/np.session';

export async function registerDataSource(req: Request, res: Response, next: NextFunction) {

    try {

        // #swagger.tags = ['ConnectorRegistrationController']
        // #swagger.description = 'Endpoint to register or unregister a datasource.'

        /* 
        #swagger.requestBody = {
            required: true,
                content : {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/regdsReq" }
                        }
                    }
        } 
        */

        const offeringId = req.body.offeringId
        const description = req.body.description
        const url = req.body.url
        const action = req.body.action

        const timestamp = getTimestamp()

        const db = await openDb()

        const insert = 'INSERT INTO DataSources(OfferingId, Description, Url, Timestamp) VALUES (?, ?, ?, ?)'
        const select = 'SELECT * FROM DataSources WHERE OfferingId=?'
        const unregister = 'DELETE FROM DataSources WHERE OfferingId=?'

        const selectParams = [offeringId]
        const deregisterParams = [offeringId]
        const insertParams = [offeringId, description, url, timestamp]

        if (action === 'register') {

            const selectResult = await db.get(select, selectParams)

            if (selectResult === undefined) {
                await db.run(insert, insertParams)
                await db.close()

                res.status(200).send('OK')
            } else {
                res.send({ msg: `Data source with offeringId ${offeringId} already registered` })
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