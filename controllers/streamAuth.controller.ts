import { Request, NextFunction, Response } from 'express';
import jwtDecode, { JwtPayload } from "jwt-decode";

export async function aclCheck(req: Request, res: Response, next: NextFunction) {
    
    try {

        const bearerToken = req.header('authorization')?.replace("Bearer ", "")
        const decoded = jwtDecode<JwtPayload>(bearerToken!)
    
        if ( (req.body.clientid === decoded.sub) && (req.body.topic.startsWith('/to/' + req.body.clientid) || req.body.topic.startsWith('/from/' + req.body.clientid))) {
                res.sendStatus(200)
            } else {
                res.sendStatus(400)
        }
    } catch (error) {
        next(error)   
    }
}