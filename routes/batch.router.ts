import { requestValidation } from '../middleware/requestValidation';
import { RequestHandler } from 'express';
import * as express from 'express';
import * as requestProcess from '../middleware/requestProcess';
import * as batchController from '../controllers/batch.controller';
import passportPromise from '../middleware/passport';
import config from '../config/config';

const batchRouter = express.Router()

export default async (): Promise<typeof batchRouter> => {

    const cors: RequestHandler = (req, res, next) => {
        res.header('Access-Control-Allow-Origin', config.api.allowedOrigin)
        res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type')
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        res.header('Allow', 'GET, POST, OPTIONS')
        next()
      }
      
    const passport = await passportPromise()
    batchRouter.use(cors)
    
    batchRouter.get('/batch/listDataSourceFiles/:offeringId', batchController.listDataSourceFiles
    )

    batchRouter.post('/batch/:data/:agreementId', 
    passport.authenticate('jwtBearer', { session: false }), requestProcess.batchReqProcessing, requestValidation, batchController.poo
    )

    batchRouter.post('/batch/pop', 
    passport.authenticate('jwtBearer', { session: false }), requestProcess.popReqProcessing, requestValidation, batchController.pop
    )

    return batchRouter
}