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