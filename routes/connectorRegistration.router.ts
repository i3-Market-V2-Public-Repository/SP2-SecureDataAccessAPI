import { requestValidation } from '../middleware/requestValidation';
import { RequestHandler } from 'express';
import { registerDataSource } from '../controllers/connectorRegistration.contorller';
import * as requestProcess from '../middleware/requestProcess';
import * as express from 'express';
import passportPromise from '../middleware/passport';
import config from '../config/config';

const connectorRegistrationRouter = express.Router()

export default async (): Promise<typeof connectorRegistrationRouter> => {

    const cors: RequestHandler = (req, res, next) => {
        res.header('Access-Control-Allow-Origin', config.api.allowedOrigin)
        res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type')
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        res.header('Allow', 'GET, POST, OPTIONS')
        next()
      }
      
    const passport = await passportPromise()
    connectorRegistrationRouter.use(cors)

    connectorRegistrationRouter.post('/regds', passport.authenticate('digest', { session: false }), requestProcess.regdsReqProcessing, requestValidation, registerDataSource)

    return connectorRegistrationRouter
}


