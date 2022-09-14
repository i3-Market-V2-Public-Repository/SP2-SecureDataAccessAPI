import { Request, NextFunction, Response } from 'express';
import { decode } from 'jsonwebtoken'
import { _createJwt } from '../common/common';
import { TokenSet } from 'openid-client';
import * as util from 'util'

export async function oidcCb(req: Request, res: Response, next: NextFunction) {

        if (req.user === undefined) throw new Error('token not received')
        console.log(req.user)
        const tokenSet = req.user as TokenSet
  
        console.log(`Access token: ${tokenSet.access_token ?? 'not received'}`)
        if (tokenSet.access_token !== undefined) console.log(util.inspect(decode(tokenSet.access_token, { complete: true }), false, null, true))
  
        console.log(`id token: ${tokenSet.id_token ?? 'not received'}`)
        if (tokenSet.id_token !== undefined) console.log(util.inspect(decode(tokenSet.id_token, { complete: true }), false, null, true))
  
        const jwt = _createJwt({ sub: tokenSet.claims().sub, scope: tokenSet.scope ?? '' })
  
        res.json({ type: 'jwt', jwt })
}