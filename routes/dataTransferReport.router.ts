import * as express from 'express'
import * as requestProcess from '../middleware/requestProcess'
import { requestValidation } from '../middleware/requestValidation'
import *  as dataTransferReportController from '../controllers/dataTransferReport.controller'
require('isomorphic-fetch');

const dataTransferReportRouter = express.Router()

export default async (): Promise<typeof dataTransferReportRouter> => {

    dataTransferReportRouter.post('/nrpCompletenessCheck', requestProcess.verificationReqProcessing, requestValidation, dataTransferReportController.nrpCompletenessCheck)
    dataTransferReportRouter.get('/getListOfVerificationRequests/:agreementId', requestProcess.listOfVerificationReqProcessing, requestValidation, dataTransferReportController.getListOfVerificationRequests)
    dataTransferReportRouter.get('/accountDataBlock/:exchangeId', dataTransferReportController.accountDataBlock)

    return dataTransferReportRouter
}