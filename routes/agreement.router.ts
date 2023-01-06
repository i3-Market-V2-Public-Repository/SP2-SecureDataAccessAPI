import { RequestHandler } from 'express';
import { requestValidation } from '../middleware/requestValidation';
import * as express from 'express';
import * as requestProcess from '../middleware/requestProcess';
import * as agreementController from '../controllers/agreement.controller';
import passportPromise from '../middleware/passport';
import config from '../config/config';

require('isomorphic-fetch');

const agreementRouter = express.Router()

export default async (): Promise<typeof agreementRouter> => {

    const cors: RequestHandler = (req, res, next) => {
        res.header('Access-Control-Allow-Origin', config.api.allowedOrigin)
        res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type')
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        res.header('Allow', 'GET, POST, OPTIONS')
        next()
      }
      
    const passport = await passportPromise()
    agreementRouter.use(cors)

    agreementRouter.post('/agreement/payMarketFee/:agreementId', requestProcess.feeReqProcessing, requestValidation, agreementController.payMarketFee)

    agreementRouter.post('/agreement/deployRawPaymentTransaction/:agreementId', passport.authenticate('jwtBearer', { session: false }),
    requestProcess.feeTxReqProcessing, requestValidation, agreementController.deployRawPaymentTransaction)

    agreementRouter.get('/agreement/getAgreementId/:exchangeId', agreementController.getAgreementId)
    agreementRouter.get('/agreement/getDataExchangeAgreement/:agreementId', requestProcess.listOfVerificationReqProcessing, requestValidation, agreementController.getDataExchangeAgreement)
    agreementRouter.post('/agreement/dataSharingAgreementInfo', requestProcess.dataExchangeAgreementInfoProcessing, requestValidation, agreementController.prerequisiteInfo)

    return agreementRouter
}