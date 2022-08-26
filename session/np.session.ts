import * as nonRepudiationLibrary from '@i3m/non-repudiation-library'
import { Session } from 'express-session';
import { SessionSchema } from '../types/openapi'

class NpSession {
    //users = <SessionSchema>{}
    users: Record<string, SessionSchema> = {}

    set(userId: string, agreementId: number, npProvider:nonRepudiationLibrary.NonRepudiationProtocol.NonRepudiationOrig) {
        this.users[userId] = { 
            npProvider: npProvider,
            consumerId: userId,
            agreementId: agreementId
        };
    }
 
    get(userId: string) {
        return this.users[userId];
    }
 }
 
 let npsession = new NpSession();

 export default  npsession