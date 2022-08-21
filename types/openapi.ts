export interface ApiError {
    name: string;
    description: string;
}

export interface BatchRequest {
    data: string;
    agreementId: number;
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