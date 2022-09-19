import { requestValidation } from '../middleware/requestValidation';
import * as express from 'express';
import * as requestProcess from '../middleware/requestProcess';
import * as agreementController from '../controllers/agreement.controller';

require('isomorphic-fetch');

const agreementRouter = express.Router()

export default async (): Promise<typeof agreementRouter> => {

    agreementRouter.post('/getProviderPublicKey', requestProcess.getProviderPublicKeyReqProcessing, requestValidation, agreementController.getDaaPublicKey)
    agreementRouter.post('/payMarketFee/:offeringId', requestProcess.feeReqProcessing, requestValidation, agreementController.payMarketFee)
    agreementRouter.get('/getAgreementId/:exchangeId', agreementController.getAgreementId)
    agreementRouter.post('/getDataExchangeAgreement', requestProcess.dataExchangeAgreementReqProcessing, requestValidation, agreementController.getDataExchangeAgreement)

    return agreementRouter
}