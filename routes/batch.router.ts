import * as express from 'express'
import * as requestProcess from '../middleware/requestProcess'
import { requestValidation } from '../middleware/requestValidation'
import *  as batchController from '../controllers/batch.controller'
import passportPromise from '../middleware/passport'
import { RequestHandler } from 'express'
import config from '../config/config'

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
    
    batchRouter.post('/:data/:agreementId/:signature', 
    passport.authenticate('jwtBearer', { session: false }), requestProcess.batchReqProcessing, requestValidation, batchController.poo
    )

    batchRouter.post('/pop', 
    passport.authenticate('jwtBearer', { session: false }), batchController.pop
    )
    
    return batchRouter
}