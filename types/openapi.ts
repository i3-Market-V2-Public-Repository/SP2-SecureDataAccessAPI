import * as nonRepudiationLibrary from '@i3m/non-repudiation-library'

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

export interface Agreement {
    agreementId:               number;
    providerPublicKey:         string;
    consumerPublicKey:         string;
    dataExchangeAgreementHash: string;
    dataOffering:              DataOffering;
    purpose:                   string;
    state:                     number;
    providerId:                string;
    consumerId:                string;
    agreementDates:            number[];
    intendedUse:               IntendedUse;
    licenseGrant:              LicenseGrant;
    dataStream:                boolean;
    signed:                    boolean;
    violation:                 Array<ViolationClass | number | string>;
}

export interface DataOffering {
    dataOfferingId:      string;
    dataOfferingVersion: number;
}

export interface IntendedUse {
    processData:             boolean;
    shareDataWithThirdParty: boolean;
    editData:                boolean;
}

export interface LicenseGrant {
    copydata:      boolean;
    transferable:  boolean;
    exclusiveness: boolean;
    revocable:     boolean;
}

export interface ViolationClass {
    violationType: number;
    issuerId:      string;
}

export interface SessionSchema {
    npProvider: nonRepudiationLibrary.NonRepudiationProtocol.NonRepudiationOrig,
    consumerId: string,
    agreementId: number
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
    blockHash:         string;
    blockNumber:       number;
    contractAddress:   null;
    cumulativeGasUsed: number;
    from:              string;
    gasUsed:           number;
    logs:              Log[];
    logsBloom:         string;
    status:            boolean;
    to:                string;
    transactionHash:   string;
    transactionIndex:  number;
}

export interface Log {
    address:          string;
    topics:           string[];
    data:             string;
    blockNumber:      number;
    transactionHash:  string;
    transactionIndex: number;
    blockHash:        string;
    logIndex:         number;
    removed:          boolean;
    id:               string;
}