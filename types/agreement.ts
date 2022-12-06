export interface Agreement {
    agreementId:               number;
    providerPublicKey:         string;
    consumerPublicKey:         string;
    dataExchangeAgreementHash: string;
    dataOffering:              DataOffering;
    purpose:                   string;
    state:                     number;
    agreementDates:            number[];
    intendedUse:               IntendedUse;
    licenseGrant:              { [key: string]: boolean };
    dataStream:                boolean;
    personalData:              boolean;
    pricingModel:              PricingModel;
    violation:                 Violation;
    signatures:                Signatures;
}

export interface DataOffering {
    dataOfferingId:      string;
    dataOfferingVersion: number;
    dataOfferingTitle:   string;
}

export interface IntendedUse {
    processData:             boolean;
    shareDataWithThirdParty: boolean;
    editData:                boolean;
}

export interface PricingModel {
    paymentType:           string;
    price:                 number;
    currency:              string;
    fee:                   number;
    paymentOnSubscription: PaymentOnSubscription;
    isFree:                boolean;
}

export interface PaymentOnSubscription {
    timeDuration: string;
    repeat:       string;
}

export interface Signatures {
    providerSignature: string;
    consumerSignature: string;
}

export interface Violation {
    violationType: number;
}
