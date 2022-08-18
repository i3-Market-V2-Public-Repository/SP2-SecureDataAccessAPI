import { NextFunction, Request, Response } from 'express'
import { BatchInput } from '../types/openapi';



const batchInputProcessing = async (req: Request, res: Response, next: NextFunction) => {

    const input: BatchInput = {
        data: req.params.data,
        agreementId: Number(req.params.agreementId),
        blockId: req.body.blockId,
        blockAck: req.body.blockAck
      };
    
    const rules = {
        'data': 'required|string',
        'agreementId': 'required|integer',
        'blockId': 'required|hash:sha256',
        'blockAck': 'required|hash:sha256',
      };

    res.locals = { input, rules }

    next()
}

export { batchInputProcessing }