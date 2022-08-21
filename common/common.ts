import { env } from "../config/env";
import { PaymentBody } from "../types/openapi";

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