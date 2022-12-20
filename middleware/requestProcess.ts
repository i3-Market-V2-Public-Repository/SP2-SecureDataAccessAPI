import { NextFunction, Request, Response } from 'express';
import { BatchRequest, FeeRequest, FeeTxRequest, ListOfVerificationRequest, PopRequest, Prerequisite, RegdsRequest, VerificationRequest } from '../types/openapi';
import { DataExchangeAgreement } from '@i3m/non-repudiation-library';


export function batchReqProcessing(req: Request, res: Response, next: NextFunction) {

  const input: BatchRequest = {
    data: req.params.data,
    agreementId: Number(req.params.agreementId),
    blockId: req.body.blockId,
    blockAck: req.body.blockAck
  };

  const rules = {
    'data': 'required|string',
    'agreementId': 'required|integer',
    'blockId': 'required|string',
    'blockAck': 'required|string',
  };

  res.locals.reqParams = { input, rules }

  next()
}

export function getProviderPublicKeyReqProcessing(req: Request, res: Response, next: NextFunction) {

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
    agreementId: req.params.agreementId,
    senderAddress: req.body.senderAddress,
    providerMPAddress: req.body.providerMPAddress,
    consumerMPAddress: req.body.consumerMPAddress
  };

  const rules = {
    'agreementId': 'required|string',
    'senderAddress': 'required|string',
    'providerMPAddress': 'required|string'
  };

  res.locals.reqParams = { input, rules }

  next()
}

export function feeTxReqProcessing(req: Request, res: Response, next: NextFunction) {

  const input: FeeTxRequest = {
    agreementId: req.params.agreementId,
    serializedTx: req.body.serializedTx
  };

  const rules = {
    'agreementId': 'required|string',
    'serializedTx': 'required|string',
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
    'offeringId': 'required|string',
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

export function dataExchangeAgreementInfoProcessing(req: Request, res: Response, next: NextFunction) {

  const input: Prerequisite = req.body

  const rules = {
    'agreementId': 'required|integer',
    'providerPrivateKey': 'required|object',
    'dataExchangeAgreement.orig': 'required|object',
    'dataExchangeAgreement.dest': 'required|object',
    'dataExchangeAgreement.encAlg': 'required|in:A128GCM,A256GCM',
    'dataExchangeAgreement.signingAlg': 'required|in:ES256,ES384,ES512',
    'dataExchangeAgreement.hashAlg': 'required|in:SHA-256,SHA-384,SHA-512',
    'dataExchangeAgreement.ledgerContractAddress': 'required|string',
    'dataExchangeAgreement.ledgerSignerAddress': 'required|string',
    'dataExchangeAgreement.pooToPorDelay': 'required|integer',
    'dataExchangeAgreement.pooToPopDelay': 'required|integer',
    'dataExchangeAgreement.pooToSecretDelay': 'required|integer'
  };

  const msg = {
    'dataExchangeAgreement.encAlg.in': 'Must be A128GCM or A256GCM',
    'dataExchangeAgreement.signingAlg.in': 'Must be ES256, ES384 or ES512',
    'dataExchangeAgreement.hashAlg.in': 'Must be SHA-256, SHA-384 or SHA-512'
  }

  res.locals.reqParams = { input, rules, msg }

  next()
}