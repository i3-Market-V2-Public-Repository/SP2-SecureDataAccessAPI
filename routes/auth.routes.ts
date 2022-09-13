import passportPromise from '../middleware/passport'
import * as express from 'express'
import config from '../config/config'
import { RequestHandler } from 'express'
import * as authController from '../controllers/auth.controller'

const authRouter = express.Router()

export default async (): Promise<typeof authRouter> => {

    const cors: RequestHandler = (req, res, next) => {
        res.header('Access-Control-Allow-Origin', config.api.allowedOrigin)
        res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type')
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        res.header('Allow', 'GET, POST, OPTIONS')
        next()
      }
      
    const passport = await passportPromise()
    authRouter.use(cors)
  
    authRouter.get('/oidc/login/provider',
      passport.authenticate('oidc', { scope: 'openid vc vce:provider' })
    )
  
    authRouter.get('/oidc/login/consumer',
      passport.authenticate('oidc', { scope: 'openid vc vce:consumer' })
    )
  
    authRouter.get('/oidc/cb', 
    passport.authenticate('oidc', { session: false }), authController.oidcCb
    )
    
    authRouter.get('/digestAuthTest',
    passport.authenticate('digest', { session: false }), function(req, res) {
        res.send({msg: 'Digest auth'})
    })

    return authRouter
}