import * as express from 'express'
import * as requestProcess from '../middleware/requestProcess'
import { requestValidation } from '../middleware/requestValidation'
import * as agreementController from '../controllers/agreement.controller'

require('isomorphic-fetch');

const agreementRouter = express.Router()

export default async (): Promise<typeof agreementRouter> => {

    agreementRouter.post('/getProviderPublicKey', requestProcess.dataExchangeAgreementReqProcessing, requestValidation, agreementController.getDaaPublicKey)
    agreementRouter.post('/payMarketFee/:offeringId', requestProcess.feeReqProcessing, requestValidation, agreementController.payMarketFee)
    
    return agreementRouter
}