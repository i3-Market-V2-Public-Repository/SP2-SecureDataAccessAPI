import { requestValidation } from '../middleware/requestValidation';
import * as express from 'express';
import * as requestProcess from '../middleware/requestProcess';
import * as agreementController from '../controllers/agreement.controller';

require('isomorphic-fetch');

const agreementRouter = express.Router()

export default async (): Promise<typeof agreementRouter> => {

    agreementRouter.post('/agreement/getProviderPublicKey', requestProcess.getProviderPublicKeyReqProcessing, requestValidation, agreementController.getDaaPublicKey)
    agreementRouter.post('/agreement/payMarketFee/:offeringId', requestProcess.feeReqProcessing, requestValidation, agreementController.payMarketFee)
    agreementRouter.get('/agreement/getAgreementId/:exchangeId', agreementController.getAgreementId)
    agreementRouter.post('/agreement/getDataExchangeAgreement', requestProcess.dataExchangeAgreementReqProcessing, requestValidation, agreementController.getDataExchangeAgreement)

    return agreementRouter
}