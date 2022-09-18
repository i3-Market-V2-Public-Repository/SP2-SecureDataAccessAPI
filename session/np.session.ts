import { Mode } from '../types/openapi';
import * as nonRepudiationLibrary from '@i3m/non-repudiation-library';

class NpSession {

    users: Record<string, Mode> = {}

    set(consumerId: string, agreementId: number, npProvider: nonRepudiationLibrary.NonRepudiationProtocol.NonRepudiationOrig, mode: string) {

        if (mode === 'batch') {
            this.users[consumerId] = {
                batch: {
                npProvider: npProvider,
                agreementId: agreementId
                }
            };
        } else if (mode === 'stream') {
            this.users[consumerId] = {
                stream: {
                npProvider: npProvider,
                agreementId: agreementId
                }
            };
        }
    }

    get(consumerId: string) {
        return this.users[consumerId];
    }
}

let npsession = new NpSession();
npsession
export default npsession