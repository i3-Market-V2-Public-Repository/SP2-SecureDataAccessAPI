import { RequestHandler } from 'express'
import * as express from 'express'
import * as authController from '../controllers/oidcAuth.controller'
import config from '../config/config'
import passportPromise from '../middleware/passport'


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
    // #swagger.tags = ['OidcAuthController']
    // #swagger.description = 'Endpoint to retrieve a bearer token as provider.'
      passport.authenticate('oidc', { scope: 'openid vc vce:provider' })
    )
  
    authRouter.get('/oidc/login/consumer',
    // #swagger.tags = ['OidcAuthController']
    // #swagger.description = 'Endpoint to retrieve a bearer token as consumer.'
      passport.authenticate('oidc', { scope: 'openid vc vce:consumer' })
    )
    

    authRouter.get('/oidc/cb',
    // #swagger.tags = ['OidcAuthController']
    // #swagger.description = 'Endpoint for call back.' 
    passport.authenticate('oidc', { session: false }), authController.oidcCb
    )

    return authRouter
}