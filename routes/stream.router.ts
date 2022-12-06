import { requestValidation } from '../middleware/requestValidation';
import { RequestHandler } from 'express';
import { registerDataSource, newData } from '../controllers/stream.controller';
import * as requestProcess from '../middleware/requestProcess';
import * as express from 'express';
import passportPromise from '../middleware/passport';
import config from '../config/config';

const streamRouter = express.Router()

export default async (): Promise<typeof streamRouter> => {

    const rawParser = express.raw({ type: "application/octet-stream", limit: 1048576});

    const cors: RequestHandler = (req, res, next) => {
        res.header('Access-Control-Allow-Origin', config.api.allowedOrigin)
        res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type')
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        res.header('Allow', 'GET, POST, OPTIONS')
        next()
      }
      
    const passport = await passportPromise()
    streamRouter.use(cors)

    streamRouter.post('/regds', passport.authenticate('digest', { session: false }), requestProcess.regdsReqProcessing, requestValidation, registerDataSource)
    streamRouter.post('/newdata/:offeringId', rawParser, passport.authenticate('digest', { session: false }), newData)

    return streamRouter
}


