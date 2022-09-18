import { NextFunction, Request, Response } from 'express';
import { BatchRequest, FeeRequest, ListOfVerificationRequest, PopRequest, RegdsRequest, VerificationRequest } from '../types/openapi';
import { DataExchangeAgreement } from '@i3m/non-repudiation-library';


export function batchReqProcessing(req: Request, res: Response, next: NextFunction) {

  const input: BatchRequest = {
    data: req.params.data,
    agreementId: Number(req.params.agreementId),
    signature: req.params.signature,
    blockId: req.body.blockId,
    blockAck: req.body.blockAck
  };

  const rules = {
    'data': 'required|string',
    'agreementId': 'required|integer',
    'signature': 'required|string',
    'blockId': 'required|string',
    'blockAck': 'required|string',
  };

  res.locals.reqParams = { input, rules }

  next()
}

export function dataExchangeAgreementReqProcessing(req: Request, res: Response, next: NextFunction) {

  const input: DataExchangeAgreement = req.body

  const rules = {
    'orig': 'required|object',
    'encAlg': 'required|in:A128GCM,A256GCM',
    'signingAlg': 'required|in:ES256,ES384,ES512',
    'hashAlg': 'required|in:SHA-256,SHA-384,SHA-512',
    'ledgerContractAddress': 'required|string',
    'ledgerSignerAddress': 'required|string',
    'pooToPorDelay': 'required|integer',
    'pooToPopDelay': 'required|integer',
    'pooToSecretDelay': 'required|integer'
  };

  const msg = {
    'encAlg.in': 'Must be A128GCM or A256GCM',
    'signingAlg.in': 'Must be ES256, ES384 or ES512',
    'hashAlg.in': 'Must be SHA-256, SHA-384 or SHA-512'
  }

  res.locals.reqParams = { input, rules, msg }

  next()
}

export function feeReqProcessing(req: Request, res: Response, next: NextFunction) {

  const input: FeeRequest = {
    offeringId: req.params.offeringId,
    senderAddress: req.body.senderAddress,
    providerAddress: req.body.providerAddress
  };

  const rules = {
    'offeringId': 'required|string',
    'senderAddress': 'required|string',
    'providerAddress': 'required|string'
  };

  res.locals.reqParams = { input, rules }

  next()
}

export function verificationReqProcessing(req: Request, res: Response, next: NextFunction) {

  const input: VerificationRequest = {
    verificationRequest: req.body.verificationRequest
  };

  const rules = {
    'verificationRequest': 'required|string',
  };

  res.locals.reqParams = { input, rules }

  next()
}

export function listOfVerificationReqProcessing(req: Request, res: Response, next: NextFunction) {

  const input: ListOfVerificationRequest = {
    agreementId: Number(req.params.agreementId)
  };

  const rules = {
    'agreementId': 'required|integer',
  };

  res.locals.reqParams = { input, rules }

  next()
}

export function popReqProcessing(req: Request, res: Response, next: NextFunction) {

  const input: PopRequest = {
    por: String(req.params.por)
  };

  const rules = {
    'por': 'required|string',
  };

  res.locals.reqParams = { input, rules }

  next()
}

export function regdsReqProcessing(req: Request, res: Response, next: NextFunction) {

  const input: RegdsRequest = req.body

  const rules = {
    'uid': 'required|string',
    'description': 'required|string',
    'url': 'required|string',
    'action': 'required|in:register,unregister'
  };

  const msg = {
    'action.in': 'Must be register or unregister'
  }

  res.locals.reqParams = { input, rules, msg }

  next()
}