import { Mode } from '../types/openapi';
import * as nonRepudiationLibrary from '@i3m/non-repudiation-library';
import { Agreement } from '../types/agreement';

class NpSession {

    users: Record<string, Mode> = {}

    set(consumerId: string, agreementId: number, npProvider: nonRepudiationLibrary.NonRepudiationProtocol.NonRepudiationOrig, 
        agreement: Agreement, payment: boolean, mode: string) {
        
        if (this.users[consumerId] === undefined) {
            this.users[consumerId] = {}
        }
        
        this.users[consumerId] = Object.assign(this.users[consumerId], 
            {   
                [mode]: {
                    npProvider: npProvider,
                    agreementId: agreementId,
                    agreement: agreement,
                    payment: payment
                }
            })
    }

    get(consumerId: string) {
        return this.users[consumerId];
    }
}

let npsession = new NpSession();
npsession
export default npsession