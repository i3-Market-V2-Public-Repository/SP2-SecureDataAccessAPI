import * as express from 'express'
import { dataExchangeAgreementReqProcessing } from '../middleware/requestProcess'
import { requestValidation } from '../middleware/requestValidation'
import * as agreementController from '../controllers/agreement.controller'

require('isomorphic-fetch');

const agreementRouter = express.Router()

export default async (): Promise<typeof agreementRouter> => {

    agreementRouter.post('/getProviderPublicKey', dataExchangeAgreementReqProcessing, requestValidation, agreementController.getDaaPublicKey)
    
    return agreementRouter
}