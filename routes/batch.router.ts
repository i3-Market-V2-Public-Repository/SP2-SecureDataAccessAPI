import * as express from 'express'
import *  as nrpController from '../controllers/batch.controller'
require('isomorphic-fetch');

const batchRouter = express.Router()

export default async (): Promise<typeof batchRouter> => {

    batchRouter.get('/poo', nrpController.poo)
    batchRouter.post('/por', nrpController.por)
    
    return batchRouter
}