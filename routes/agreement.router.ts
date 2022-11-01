import { requestValidation } from '../middleware/requestValidation';
import * as express from 'express';
import * as requestProcess from '../middleware/requestProcess';
import * as agreementController from '../controllers/agreement.controller';

require('isomorphic-fetch');

const agreementRouter = express.Router()

export default async (): Promise<typeof agreementRouter> => {

    agreementRouter.post('/agreement/payMarketFee/:offeringId', requestProcess.feeReqProcessing, requestValidation, agreementController.payMarketFee)
    agreementRouter.get('/agreement/getAgreementId/:exchangeId', agreementController.getAgreementId)
    agreementRouter.get('/agreement/getDataExchangeAgreement/:agreementId', requestProcess.listOfVerificationReqProcessing, requestValidation, agreementController.getDataExchangeAgreement)
    agreementRouter.post('/agreement/dataExchangeAgreementInfo', requestProcess.dataExchangeAgreementInfoProcessing, requestValidation, agreementController.prerequisiteInfo)

    return agreementRouter
}