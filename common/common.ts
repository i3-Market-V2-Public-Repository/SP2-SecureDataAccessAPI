import { env } from "../config/env";
import { PaymentBody } from "../types/openapi";
import { Agreement } from '../types/openapi';
import 'isomorphic-fetch';

export async function retrieveRawPaymentTransaction (payment: PaymentBody) {

    const request = await fetch(`${env.tokenizerUrl}/api/v1/treasury/transactions/payment`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payment)
    });

    const rawTransaction = await request.json();
    console.log(rawTransaction)

    return rawTransaction
}

export async function retrievePrice (offeringId: string) {

    const request = await fetch(`${env.backplaneUrl}/semantic-engine/api/registration/offering/${offeringId}/offeringId`, {
          method: 'GET',
          headers: {
              'Accept': '*/*'
          },
    });
    const offering = await request.json();
    const price = offering.hasPricingModel.basicPrice

    return price
}

export async function fetchSignedResolution (verificationRequest: string) {

    const verification = await fetch(`${env.backplaneUrl}/conflictResolverService/verification`, {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({"verificationRequest": verificationRequest}),
    });
    const resolution = await verification.json();
    console.log(JSON.stringify({"verificationRequest": verificationRequest}))
    console.log(JSON.stringify(resolution))
    const signedResolution = resolution.signedResolution

    return signedResolution
}

export async function getAgreement (agreementId: number) {

    const request = await fetch(`${env.smartContractManager}/get_agreement/${agreementId}`, {
          method: 'GET',
          headers: {
              'Accept': '*/*'
          },
    });
    const agreement = await request.json();

    return agreement
}

export function getTimestamp() {
    const currentDate = new Date();
    const dateFormat = `${currentDate.getFullYear()}` +  '-' + ("0" + (currentDate.getMonth() + 1)).slice(-2) + '-' + ("0" + currentDate.getDate()).slice(-2) 
    return dateFormat;
}