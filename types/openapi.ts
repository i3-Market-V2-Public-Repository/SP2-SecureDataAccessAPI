export interface ApiError {
    name: string;
    description: string;
}

export interface BatchInput {
    data: string;
    agreementId: number;
    blockId: string;
    blockAck: string;
}