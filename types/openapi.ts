import * as nonRepudiationLibrary from '@i3m/non-repudiation-library';
import { DataExchangeAgreement, JWK } from '@i3m/non-repudiation-library';
import { Agreement } from './agreement';

export interface ApiError {
    name: string;
    description: string;
}

export interface BatchRequest {
    data: string;
    agreementId: number;
    signature: string;
    blockId: string;
    blockAck: string;
}

export interface FeeRequest {
    offeringId: string;
    senderAddress: string;
    providerAddress: string;
}

export interface PaymentBody {
    senderAddress: string;
    providerAddress: string;
    amount: string;
}

export interface DataOffering {
    dataOfferingId: string;
    dataOfferingVersion: number;
}

export interface IntendedUse {
    processData: boolean;
    shareDataWithThirdParty: boolean;
    editData: boolean;
}

export interface LicenseGrant {
    copydata: boolean;
    transferable: boolean;
    exclusiveness: boolean;
    revocable: boolean;
}

export interface ViolationClass {
    violationType: number;
    issuerId: string;
}

export interface Mode {
    batch?: SessionSchema;
    stream?: SessionSchema;
}
export interface SessionSchema {
    npProvider?: nonRepudiationLibrary.NonRepudiationProtocol.NonRepudiationOrig;
    agreementId: number;
    agreement: Agreement;
}

export interface VerificationRequest {
    verificationRequest: string;
}

export interface ListOfVerificationRequest {
    agreementId: number;
}

export interface BatchDaaResponse {
    blockId: string;
    nextBlockId: string;
    poo: string;
    cipherBlock: string;
    transactionObject?: TransactionObject;
}

export interface ResponseData {
    data: Buffer;
    nextBlockId: string;
}

export interface JsonMapOfData {
    records: Record<string, string>[];
}

export interface TransactionObject {
    transactionObject: TransactionObjectClass;
}

export interface TransactionObjectClass {
    blockHash: string;
    blockNumber: number;
    contractAddress: null;
    cumulativeGasUsed: number;
    from: string;
    gasUsed: number;
    logs: Log[];
    logsBloom: string;
    status: boolean;
    to: string;
    transactionHash: string;
    transactionIndex: number;
}

export interface Log {
    address: string;
    topics: string[];
    data: string;
    blockNumber: number;
    transactionHash: string;
    transactionIndex: number;
    blockHash: string;
    logIndex: number;
    removed: boolean;
    id: string;
}

export interface JwtClaims {
    sub: string;
    scope: string;
}

export interface PopRequest {
    por: string;
}

export interface RegdsRequest {
    uid: string;
    description: string;
    url: string;
    action: string;
}

export interface MqttOptions {
    clientId: string;
    username: string;
    password: string;
    clean: boolean;
}

export interface MqttParams {
    messageSplit: string[];
    topicSplit: string[];
    consumerDid: string;
    offeringId: string;
    timestamp: string;
    topicSubscribedTo: string;
    topicUnsubscribedTo: string;
    agreementId: string;
    ammountOfDataReceived: number;
}

export interface DataSourcesRow {
    OfferingId: string;
    Description: string;
    Url: string;
    Timestamp: string;
}

export interface StreamSubscribersRow {
    ConsumerDid: string;
    OfferingId: string;
    AgreementId: string;
    Timestamp: string;
    SubId: string
    AmmountOfDataReceived: string;
}

export interface StreamResponse {
    poo: string;
    cipherBlock: string;
}

export interface DataExchangeAgreementReq {
    consumerPublicKey: object;
    providerPublicKey: object;
}

export interface Prerequisite {
    agreementId: number;
    providerPrivateKey: JWK;
    dataExchangeAgreement: DataExchangeAgreement;
}

export interface ConnectorResponse {
    nextBlockId: string;
    data: Buffer;
}

export interface AgreementState {
    state: string;
}

export interface SerializedTxObj {
    serializedTx: string;
}

export interface FeeTxRequest {
    agreementId: string;
    serializedTx: string;
}