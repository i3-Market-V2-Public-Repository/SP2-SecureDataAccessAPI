import { HttpInitiatorTransport, Session } from '@i3m/wallet-protocol'
import { WalletApi } from '@i3m/wallet-protocol-api'
import { WalletComponents } from '@i3m/wallet-desktop-openapi/types'
async function nrp () {

    const sessionObj = {"masterKey":{"from":{"name":"Initiator"},"to":{"name":"Wallet desktop"},"port":29170,"na":"h8DB77k9XWgewetKEp7Apg","nb":"h-xMBHxPM88-k4-kBWixEA","secret":"K8FDajVCpbQtSqi4CmRHUkhg8ndJEWhP-KYyBW8N8pk"},"code":"65794a68624763694f694a6b615849694c434a6c626d4d694f694a424d6a553252304e4e496e302e2e4248704f5a625f43454b6e42546a7a4f2e4e6e6c61424941565452394642466871557a7450494c715354493643726679695259635f35543277566149554d2d7550593841492d366a7842373475685f2d46357250685f6973556b424471614b6c6f746f4a313165727333535745554451623858665765696955584635304838396f4a5946646242776d535a59396d74746f4c5456585368774937383153617066654656395f7a547745625a683674445635376d34517143395254344f79337438426758634c7855637576424a5f634441355954583838424d35754d4e73596a6479557854585f4f385570656d7a336473596c6c4d4d4975305f4f686c5a635263776a4162426c79456e41504c2d4c59446f786a68557a78355168642d6c6d4f30495755756d5245576f546773557664755f5656346f47553235326c596b7749752d497a6d424a42685442735639494f30784a435f464e394b655071564a5632756c6c76784e526a4871636b5871554652643448776170796b32564c3549386c504b396736444d5069457148457239412e534f373754654b6251744c63584d36733965546d6651"}
    let consumerWallet: WalletApi
    let dataSharingAgreement: WalletComponents.Schemas.DataSharingAgreement

    // Setup consumer wallet
    const transport = new HttpInitiatorTransport()
    const session = await Session.fromJSON(transport, sessionObj)
    consumerWallet = new WalletApi(session)
    dataSharingAgreement = await import('./batch-dataSharingAgreement.json') as WalletComponents.Schemas.DataSharingAgreement
    
    // Select an identity to use. In this example we get the one with alias set to 'consumer'
    const availableIdentities = await consumerWallet.identities.list()

    // The consumer DID
    const consumerDid = availableIdentities[0]
    
    console.log(consumerDid)
}   
nrp()