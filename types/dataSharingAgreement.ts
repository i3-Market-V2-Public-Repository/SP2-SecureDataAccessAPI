export interface DataSharingAgreement {
    dataOfferingDescription: DataOfferingDescription;
    parties:                 Parties;
    purpose:                 string;
    duration:                Duration;
    intendedUse:             IntendedUse;
    licenseGrant:            LicenseGrant;
    dataStream:              boolean;
    personalData:            boolean;
    pricingModel:            PricingModel;
    dataExchangeAgreement:   DataExchangeAgreement;
    signatures:              Signatures;
}

export interface DataExchangeAgreement {
    orig:                  string;
    dest:                  string;
    encAlg:                string;
    signingAlg:            string;
    hashAlg:               string;
    ledgerContractAddress: string;
    ledgerSignerAddress:   string;
    pooToPorDelay:         number;
    pooToPopDelay:         number;
    pooToSecretDelay:      number;
}

export interface DataOfferingDescription {
    dataOfferingId: string;
    version:        number;
    title:          string;
    category:       string;
    active:         boolean;
}

export interface Duration {
    creationDate: number;
    startDate:    number;
    endDate:      number;
}

export interface IntendedUse {
    processData:             boolean;
    shareDataWithThirdParty: boolean;
    editData:                boolean;
}

export interface LicenseGrant {
    "transferable": boolean,
    "exclusiveness": boolean,
    "paidUp": boolean,
    "revocable": boolean,
    "processing": boolean,
    "modifying": boolean,
    "analyzing": boolean,
    "storingData": boolean,
    "storingCopy": boolean,
    "reproducing": boolean,
    "distributing": boolean,
    "loaning": boolean,
    "selling": boolean,
    "renting": boolean,
    "furtherLicensing": boolean,
    "leasing": boolean
}

export interface Parties {
    providerDid: string;
    consumerDid: string;
}

export interface PricingModel {
    paymentType:              string;
    pricingModelName:         string;
    basicPrice:               number;
    currency:                 string;
    fee:                      number;
    hasPaymentOnSubscription: HasPaymentOnSubscription;
    hasFreePrice:             HasFreePrice;
}

export interface HasFreePrice {
    hasPriceFree: boolean;
}

export interface HasPaymentOnSubscription {
    paymentOnSubscriptionName: string;
    paymentType:               string;
    timeDuration:              string;
    description:               string;
    repeat:                    string;
    hasSubscriptionPrice:      number;
}

export interface Signatures {
    providerSignature: string;
    consumerSignature: string;
}