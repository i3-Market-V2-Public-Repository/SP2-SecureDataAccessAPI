import * as express from 'express'
import * as requestProcess from '../middleware/requestProcess'
import { requestValidation } from '../middleware/requestValidation'
import *  as batchController from '../controllers/batch.controller'
require('isomorphic-fetch');

const batchRouter = express.Router()

export default async (): Promise<typeof batchRouter> => {

    batchRouter.post('/:data/:agreementId/:signature', requestProcess.batchReqProcessing, requestValidation, batchController.poo)
    batchRouter.post('/pop', batchController.pop)
    
    return batchRouter
}