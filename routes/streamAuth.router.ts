import { RequestHandler } from 'express';
import { aclCheck } from '../controllers/streamAuth.controller';
import * as express from 'express';
import passportPromise from '../middleware/passport';
import config from '../config/config';

const streamAuthRouter = express.Router()

export default async (): Promise<typeof streamAuthRouter> => {

    const textParser = express.text({ type: "application/json" });
    const jsonParser = express.json({ type: "application/json" });

    const cors: RequestHandler = (req, res, next) => {
        res.header('Access-Control-Allow-Origin', config.api.allowedOrigin)
        res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type')
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        res.header('Allow', 'GET, POST, OPTIONS')
        next()
      }
      
    const passport = await passportPromise()
    streamAuthRouter.use(cors)
    
    streamAuthRouter.post('/stream/auth/user',
    // #swagger.tags = ['StreamAuthController']
    // #swagger.description = 'Endpoint to auth stream user.'
    textParser, passport.authenticate('jwtBearer', { session: false }), (req,res) => {
      res.sendStatus(200)
    })
    
    streamAuthRouter.post('/stream/auth/acl', 
    // #swagger.tags = ['StreamAuthController']
    // #swagger.description = 'Endpoint to check if topic subscribed to matches the requirements.'
    jsonParser, passport.authenticate('jwtBearer', { session: false }), aclCheck
    )

    return streamAuthRouter
}


