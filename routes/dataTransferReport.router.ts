import { requestValidation } from '../middleware/requestValidation';
import * as express from 'express';
import * as requestProcess from '../middleware/requestProcess';
import *  as dataTransferReportController from '../controllers/dataTransferReport.controller';

require('isomorphic-fetch');

const dataTransferReportRouter = express.Router()

export default async (): Promise<typeof dataTransferReportRouter> => {

    dataTransferReportRouter.post('/report/nrpCompletenessCheck', requestProcess.verificationReqProcessing, requestValidation, dataTransferReportController.nrpCompletenessCheck)
    dataTransferReportRouter.get('/report/getListOfVerificationRequests/:agreementId', requestProcess.listOfVerificationReqProcessing, requestValidation, dataTransferReportController.getListOfVerificationRequests)
    dataTransferReportRouter.get('/report/accountDataBlock/:exchangeId', dataTransferReportController.accountDataBlock)
    dataTransferReportRouter.get('/report/getSubId/:consumerDid/:dataSourceUid', dataTransferReportController.getSubId)
    dataTransferReportRouter.get('/report/streamingAccountReport/:subId', dataTransferReportController.streamingAccountReport)
    dataTransferReportRouter.get('/report/getAccountSummary/:consumerDid', dataTransferReportController.getAccountSummary)

    return dataTransferReportRouter
}