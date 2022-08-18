import * as nonRepudiationLibrary from '@i3m/non-repudiation-library'

class NpSession {
    users = {}
 
    set(userId:string, npProvider:nonRepudiationLibrary.NonRepudiationProtocol.NonRepudiationOrig) {
        this.users[userId] = npProvider;
    }
 
    get(userId:string) {
        return this.users[userId];
    }
 }
 
 let npsession = new NpSession();

 export default  npsession