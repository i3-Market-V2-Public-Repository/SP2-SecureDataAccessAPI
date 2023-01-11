import { StreamResponse } from '../../types/openapi';
import * as nonRepudiationLibrary from '@i3m/non-repudiation-library';
import * as mqtt from 'mqtt';
import * as fs from 'fs';
import jwtDecode, { JwtPayload } from "jwt-decode";
import { HttpInitiatorTransport, Session } from '@i3m/wallet-protocol';
import { WalletApi } from '@i3m/wallet-protocol-api';
import { parseJwk } from '@i3m/non-repudiation-library';

const consumerJwks = {
    publicJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'YI28gvV0utmvjobKned_4m63bc2SkJuKxJBllANfKUc',
      y: 'JMKzTxxe4jNcoZYO4D7Xe_nnZtKeZy5z_JmqjoUyLf8',
      alg: 'ES256'
    },
    privateJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'YI28gvV0utmvjobKned_4m63bc2SkJuKxJBllANfKUc',
      y: 'JMKzTxxe4jNcoZYO4D7Xe_nnZtKeZy5z_JmqjoUyLf8',
      d: 'KckaDbkuLIH1rbOSxEvfWgNFBcOYDsShvlzSb8N4ijI',
      alg: 'ES256'
    }
  }

const sharingAgreement = {
  "dataOfferingDescription": {
    "dataOfferingId": "63beb8fbf762242150a481e0",
    "version": 0,
    "title": "Offering Transport",
    "category": "transport",
    "active": true
  },
  "parties": {
    "providerDid": "did:ethr:i3m:0x03437770960595d9d1ccd73c5df15d688b7db8ec96567df000fdfeffa41def675f",
    "consumerDid": "did:ethr:i3m:0x037e1117d84099a5763f763960f993956dc17aacd2af06cd8a236584a547ec3fe3"
  },
  "purpose": "",
  "duration": {
    "creationDate": 1673437866,
    "startDate": 1673437866,
    "endDate": 1704973866
  },
  "intendedUse": {
    "processData": true,
    "shareDataWithThirdParty": true,
    "editData": true
  },
  "licenseGrant": {
    "transferable": true,
    "exclusiveness": true,
    "paidUp": true,
    "revocable": true,
    "processing": true,
    "modifying": true,
    "analyzing": true,
    "storingData": true,
    "storingCopy": true,
    "reproducing": true,
    "distributing": true,
    "loaning": true,
    "selling": true,
    "renting": true,
    "furtherLicensing": true,
    "leasing": true
  },
  "dataStream": true,
  "personalData": false,
  "pricingModel": {
    "paymentType": "payment on subscription",
    "pricingModelName": "string",
    "basicPrice": 0,
    "currency": "EUR",
    "fee": 0,
    "hasPaymentOnSubscription": {
      "paymentOnSubscriptionName": "",
      "paymentType": "",
      "timeDuration": "",
      "description": "",
      "repeat": "",
      "hasSubscriptionPrice": 0
    },
    "hasFreePrice": {
      "hasPriceFree": true
    }
  },
  "dataExchangeAgreement": {
    "orig": "{\"alg\":\"ES256\",\"crv\":\"P-256\",\"kty\":\"EC\",\"x\":\"gdt9dxd1Q9p5fn8Pch8tuMf6h4lZ_NtbgeVAddPkk5M\",\"y\":\"coJR5-TGBUwIV_5YovlWzt4suV0wnxfvWJDvekJBCwQ\"}",
    "dest": "{\"alg\":\"ES256\",\"crv\":\"P-256\",\"kty\":\"EC\",\"x\":\"YI28gvV0utmvjobKned_4m63bc2SkJuKxJBllANfKUc\",\"y\":\"JMKzTxxe4jNcoZYO4D7Xe_nnZtKeZy5z_JmqjoUyLf8\"}",
    "encAlg": "A128GCM",
    "signingAlg": "ES256",
    "hashAlg": "SHA-256",
    "ledgerContractAddress": "0x8d407A1722633bDD1dcf221474be7a44C05d7c2F",
    "ledgerSignerAddress": "0xdB0CE68bAbC145B18786C2D820B8CcCc40e1a4f5",
    "pooToPorDelay": 1000000,
    "pooToPopDelay": 300000,
    "pooToSecretDelay": 1800000
  },
  "signatures": {
    "providerSignature": "eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJkYXRhT2ZmZXJpbmdEZXNjcmlwdGlvbiI6eyJkYXRhT2ZmZXJpbmdJZCI6IjYzYmViOGZiZjc2MjI0MjE1MGE0ODFlMCIsInZlcnNpb24iOjAsInRpdGxlIjoiT2ZmZXJpbmcgVHJhbnNwb3J0IiwiY2F0ZWdvcnkiOiJ0cmFuc3BvcnQiLCJhY3RpdmUiOnRydWV9LCJwYXJ0aWVzIjp7InByb3ZpZGVyRGlkIjoiZGlkOmV0aHI6aTNtOjB4MDM0Mzc3NzA5NjA1OTVkOWQxY2NkNzNjNWRmMTVkNjg4YjdkYjhlYzk2NTY3ZGYwMDBmZGZlZmZhNDFkZWY2NzVmIiwiY29uc3VtZXJEaWQiOiJkaWQ6ZXRocjppM206MHgwMzdlMTExN2Q4NDA5OWE1NzYzZjc2Mzk2MGY5OTM5NTZkYzE3YWFjZDJhZjA2Y2Q4YTIzNjU4NGE1NDdlYzNmZTMifSwicHVycG9zZSI6IiIsImR1cmF0aW9uIjp7ImNyZWF0aW9uRGF0ZSI6MTY3MzQzNzg2Niwic3RhcnREYXRlIjoxNjczNDM3ODY2LCJlbmREYXRlIjoxNzA0OTczODY2fSwiaW50ZW5kZWRVc2UiOnsicHJvY2Vzc0RhdGEiOnRydWUsInNoYXJlRGF0YVdpdGhUaGlyZFBhcnR5Ijp0cnVlLCJlZGl0RGF0YSI6dHJ1ZX0sImxpY2Vuc2VHcmFudCI6eyJ0cmFuc2ZlcmFibGUiOnRydWUsImV4Y2x1c2l2ZW5lc3MiOnRydWUsInBhaWRVcCI6dHJ1ZSwicmV2b2NhYmxlIjp0cnVlLCJwcm9jZXNzaW5nIjp0cnVlLCJtb2RpZnlpbmciOnRydWUsImFuYWx5emluZyI6dHJ1ZSwic3RvcmluZ0RhdGEiOnRydWUsInN0b3JpbmdDb3B5Ijp0cnVlLCJyZXByb2R1Y2luZyI6dHJ1ZSwiZGlzdHJpYnV0aW5nIjp0cnVlLCJsb2FuaW5nIjp0cnVlLCJzZWxsaW5nIjp0cnVlLCJyZW50aW5nIjp0cnVlLCJmdXJ0aGVyTGljZW5zaW5nIjp0cnVlLCJsZWFzaW5nIjp0cnVlfSwiZGF0YVN0cmVhbSI6dHJ1ZSwicGVyc29uYWxEYXRhIjpmYWxzZSwicHJpY2luZ01vZGVsIjp7InBheW1lbnRUeXBlIjoicGF5bWVudCBvbiBzdWJzY3JpcHRpb24iLCJwcmljaW5nTW9kZWxOYW1lIjoic3RyaW5nIiwiYmFzaWNQcmljZSI6MCwiY3VycmVuY3kiOiJFVVIiLCJmZWUiOjAsImhhc1BheW1lbnRPblN1YnNjcmlwdGlvbiI6eyJwYXltZW50T25TdWJzY3JpcHRpb25OYW1lIjoiIiwicGF5bWVudFR5cGUiOiIiLCJ0aW1lRHVyYXRpb24iOiIiLCJkZXNjcmlwdGlvbiI6IiIsInJlcGVhdCI6IiIsImhhc1N1YnNjcmlwdGlvblByaWNlIjowfSwiaGFzRnJlZVByaWNlIjp7Imhhc1ByaWNlRnJlZSI6dHJ1ZX19LCJkYXRhRXhjaGFuZ2VBZ3JlZW1lbnQiOnsib3JpZyI6IntcImFsZ1wiOlwiRVMyNTZcIixcImNydlwiOlwiUC0yNTZcIixcImt0eVwiOlwiRUNcIixcInhcIjpcImdkdDlkeGQxUTlwNWZuOFBjaDh0dU1mNmg0bFpfTnRiZ2VWQWRkUGtrNU1cIixcInlcIjpcImNvSlI1LVRHQlV3SVZfNVlvdmxXenQ0c3VWMHdueGZ2V0pEdmVrSkJDd1FcIn0iLCJkZXN0Ijoie1wiYWxnXCI6XCJFUzI1NlwiLFwiY3J2XCI6XCJQLTI1NlwiLFwia3R5XCI6XCJFQ1wiLFwieFwiOlwiWUkyOGd2VjB1dG12am9iS25lZF80bTYzYmMyU2tKdUt4SkJsbEFOZktVY1wiLFwieVwiOlwiSk1LelR4eGU0ak5jb1pZTzREN1hlX25uWnRLZVp5NXpfSm1xam9VeUxmOFwifSIsImVuY0FsZyI6IkExMjhHQ00iLCJzaWduaW5nQWxnIjoiRVMyNTYiLCJoYXNoQWxnIjoiU0hBLTI1NiIsImxlZGdlckNvbnRyYWN0QWRkcmVzcyI6IjB4OGQ0MDdBMTcyMjYzM2JERDFkY2YyMjE0NzRiZTdhNDRDMDVkN2MyRiIsImxlZGdlclNpZ25lckFkZHJlc3MiOiIweGRCMENFNjhiQWJDMTQ1QjE4Nzg2QzJEODIwQjhDY0NjNDBlMWE0ZjUiLCJwb29Ub1BvckRlbGF5IjoxMDAwMDAwLCJwb29Ub1BvcERlbGF5IjozMDAwMDAsInBvb1RvU2VjcmV0RGVsYXkiOjE4MDAwMDB9LCJpc3MiOiJkaWQ6ZXRocjppM206MHgwMzQzNzc3MDk2MDU5NWQ5ZDFjY2Q3M2M1ZGYxNWQ2ODhiN2RiOGVjOTY1NjdkZjAwMGZkZmVmZmE0MWRlZjY3NWYiLCJpYXQiOjE2NzM0NDU3ODN9.45SDdxLsZgN5A9dYHOT7A_v1R7FE8HB6NNegJNGucopcj7TQjCq0xM6rMfAeCCpbcH6C6R8GxevQPriFe0gNEw",
    "consumerSignature": "eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJkYXRhT2ZmZXJpbmdEZXNjcmlwdGlvbiI6eyJkYXRhT2ZmZXJpbmdJZCI6IjYzYmViOGZiZjc2MjI0MjE1MGE0ODFlMCIsInZlcnNpb24iOjAsInRpdGxlIjoiT2ZmZXJpbmcgVHJhbnNwb3J0IiwiY2F0ZWdvcnkiOiJ0cmFuc3BvcnQiLCJhY3RpdmUiOnRydWV9LCJwYXJ0aWVzIjp7InByb3ZpZGVyRGlkIjoiZGlkOmV0aHI6aTNtOjB4MDM0Mzc3NzA5NjA1OTVkOWQxY2NkNzNjNWRmMTVkNjg4YjdkYjhlYzk2NTY3ZGYwMDBmZGZlZmZhNDFkZWY2NzVmIiwiY29uc3VtZXJEaWQiOiJkaWQ6ZXRocjppM206MHgwMzdlMTExN2Q4NDA5OWE1NzYzZjc2Mzk2MGY5OTM5NTZkYzE3YWFjZDJhZjA2Y2Q4YTIzNjU4NGE1NDdlYzNmZTMifSwicHVycG9zZSI6IiIsImR1cmF0aW9uIjp7ImNyZWF0aW9uRGF0ZSI6MTY3MzQzNzg2Niwic3RhcnREYXRlIjoxNjczNDM3ODY2LCJlbmREYXRlIjoxNzA0OTczODY2fSwiaW50ZW5kZWRVc2UiOnsicHJvY2Vzc0RhdGEiOnRydWUsInNoYXJlRGF0YVdpdGhUaGlyZFBhcnR5Ijp0cnVlLCJlZGl0RGF0YSI6dHJ1ZX0sImxpY2Vuc2VHcmFudCI6eyJ0cmFuc2ZlcmFibGUiOnRydWUsImV4Y2x1c2l2ZW5lc3MiOnRydWUsInBhaWRVcCI6dHJ1ZSwicmV2b2NhYmxlIjp0cnVlLCJwcm9jZXNzaW5nIjp0cnVlLCJtb2RpZnlpbmciOnRydWUsImFuYWx5emluZyI6dHJ1ZSwic3RvcmluZ0RhdGEiOnRydWUsInN0b3JpbmdDb3B5Ijp0cnVlLCJyZXByb2R1Y2luZyI6dHJ1ZSwiZGlzdHJpYnV0aW5nIjp0cnVlLCJsb2FuaW5nIjp0cnVlLCJzZWxsaW5nIjp0cnVlLCJyZW50aW5nIjp0cnVlLCJmdXJ0aGVyTGljZW5zaW5nIjp0cnVlLCJsZWFzaW5nIjp0cnVlfSwiZGF0YVN0cmVhbSI6dHJ1ZSwicGVyc29uYWxEYXRhIjpmYWxzZSwicHJpY2luZ01vZGVsIjp7InBheW1lbnRUeXBlIjoicGF5bWVudCBvbiBzdWJzY3JpcHRpb24iLCJwcmljaW5nTW9kZWxOYW1lIjoic3RyaW5nIiwiYmFzaWNQcmljZSI6MCwiY3VycmVuY3kiOiJFVVIiLCJmZWUiOjAsImhhc1BheW1lbnRPblN1YnNjcmlwdGlvbiI6eyJwYXltZW50T25TdWJzY3JpcHRpb25OYW1lIjoiIiwicGF5bWVudFR5cGUiOiIiLCJ0aW1lRHVyYXRpb24iOiIiLCJkZXNjcmlwdGlvbiI6IiIsInJlcGVhdCI6IiIsImhhc1N1YnNjcmlwdGlvblByaWNlIjowfSwiaGFzRnJlZVByaWNlIjp7Imhhc1ByaWNlRnJlZSI6dHJ1ZX19LCJkYXRhRXhjaGFuZ2VBZ3JlZW1lbnQiOnsib3JpZyI6IntcImFsZ1wiOlwiRVMyNTZcIixcImNydlwiOlwiUC0yNTZcIixcImt0eVwiOlwiRUNcIixcInhcIjpcImdkdDlkeGQxUTlwNWZuOFBjaDh0dU1mNmg0bFpfTnRiZ2VWQWRkUGtrNU1cIixcInlcIjpcImNvSlI1LVRHQlV3SVZfNVlvdmxXenQ0c3VWMHdueGZ2V0pEdmVrSkJDd1FcIn0iLCJkZXN0Ijoie1wiYWxnXCI6XCJFUzI1NlwiLFwiY3J2XCI6XCJQLTI1NlwiLFwia3R5XCI6XCJFQ1wiLFwieFwiOlwiWUkyOGd2VjB1dG12am9iS25lZF80bTYzYmMyU2tKdUt4SkJsbEFOZktVY1wiLFwieVwiOlwiSk1LelR4eGU0ak5jb1pZTzREN1hlX25uWnRLZVp5NXpfSm1xam9VeUxmOFwifSIsImVuY0FsZyI6IkExMjhHQ00iLCJzaWduaW5nQWxnIjoiRVMyNTYiLCJoYXNoQWxnIjoiU0hBLTI1NiIsImxlZGdlckNvbnRyYWN0QWRkcmVzcyI6IjB4OGQ0MDdBMTcyMjYzM2JERDFkY2YyMjE0NzRiZTdhNDRDMDVkN2MyRiIsImxlZGdlclNpZ25lckFkZHJlc3MiOiIweGRCMENFNjhiQWJDMTQ1QjE4Nzg2QzJEODIwQjhDY0NjNDBlMWE0ZjUiLCJwb29Ub1BvckRlbGF5IjoxMDAwMDAwLCJwb29Ub1BvcERlbGF5IjozMDAwMDAsInBvb1RvU2VjcmV0RGVsYXkiOjE4MDAwMDB9LCJpc3MiOiJkaWQ6ZXRocjppM206MHgwMzdlMTExN2Q4NDA5OWE1NzYzZjc2Mzk2MGY5OTM5NTZkYzE3YWFjZDJhZjA2Y2Q4YTIzNjU4NGE1NDdlYzNmZTMiLCJpYXQiOjE2NzM0NDU0ODF9.YPDfa3H-Z3-YVtbtMxD_6bGz0RfixnDOYuT8GsG7F-kTvtIpHD5csybcjnnHsclcSgRvnxEEpA6jmJZRon3nBg"
  }
}

const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIwLjAuMC4wIiwiYXVkIjoiMC4wLjAuMCIsImV4cCI6MTY3MzUzNjM4MCwic3ViIjoiZGlkOmV0aHI6aTNtOjB4MDM3ZTExMTdkODQwOTlhNTc2M2Y3NjM5NjBmOTkzOTU2ZGMxN2FhY2QyYWYwNmNkOGEyMzY1ODRhNTQ3ZWMzZmUzIiwic2NvcGUiOiJvcGVuaWQgdmMgdmNlOmNvbnN1bWVyIiwiaWF0IjoxNjczNDQ5OTgwfQ.yLAYlQQNwxyB8SdrpVR3YE5Tq-K4TVj7WNSEJX836yM'
const offeringId = '63beb8fbf762242150a481e0'
const agreementId = 20

async function streamSubscribe() {
    try {

        const sessionObj = JSON.parse('{"masterKey":{"from":{"name":"Initiator"},"to":{"name":"Wallet desktop"},"port":29170,"na":"btYDH3POmjv3CMGvAM0j1g","nb":"2ojicyzE_e7IoULP3xspBA","secret":"TH8B8PEvagn3K_oUMmoEThjjqpYPdkZ5h-OuwUbzktw"},"code":"65794a68624763694f694a6b615849694c434a6c626d4d694f694a424d6a553252304e4e496e302e2e4c706b54507a654d765735354c6e45792e50444543474d464a546d47464742507735335f574537447841746a4b5957396b744b5338555536352d4e4549696c4e454c33304a7a42537a65526b654d37626d4d51366e436575756f515347544c625f467670505f76424e464241547472564e4e52314e376b376e68613665744746774371475374595f313831594e63536b553378506c4b366557335f44654156413332385130664c424f64343252477271766855526a3566587a577a77796b6b51436c377a64504c52366d62746b33434a665f56506642354a3777756177686c7538397437594e5f71562d506a39464f6d456e37596a6876317567786f7466423163384e4c2d317956556b666d4d623252464144767746553051364946576c4233546938445f666a4d7444347051466f4570616f7365386c44783534754d4d37774e6f4a3553773773494c705f47705a656b444d75585570314f796c6e364d76423334694c563676386d54444856324a69703773324733373543663653765237454249466635427464354e6e335038512e616f7563734b667332594b32306f664e465f666c4777"}')
    
        // Setup consumer wallet
        const transport = new HttpInitiatorTransport()
        const session = await Session.fromJSON(transport, sessionObj)
        const consumerWallet = new WalletApi(session)

        const dataSharingAgreement = JSON.parse(JSON.stringify(sharingAgreement))

        // Add contract to wallet
        await consumerWallet.resources.create({
          type: 'Contract',
          resource: {
            dataSharingAgreement,
            keyPair: {
              publicJwk: await parseJwk(JSON.parse(JSON.stringify(consumerJwks.publicJwk)), true),
              privateJwk: await parseJwk(JSON.parse(JSON.stringify(consumerJwks.privateJwk)), true)
            }
          }
        })

        // Select an identity to use. In this example we get the one with alias set to 'consumer'
        const availableIdentities = await consumerWallet.identities.list()

        // The consumer DID
        const consumerDid = availableIdentities[0]

        const consumerDltAgent = new nonRepudiationLibrary.I3mWalletAgentDest(consumerWallet, consumerDid.did)

        const dataExchangeAgreement: nonRepudiationLibrary.DataExchangeAgreement = dataSharingAgreement.dataExchangeAgreement
        const consumerPrivateKey: nonRepudiationLibrary.JWK = JSON.parse(JSON.stringify(consumerJwks.privateJwk))

        const npConsumer = new nonRepudiationLibrary.NonRepudiationProtocol.NonRepudiationDest(dataExchangeAgreement, consumerPrivateKey, consumerDltAgent)

        const decoded = jwtDecode<JwtPayload>(bearerToken!)
        const consumerId = decoded.sub

        const options = {
            username: `${bearerToken}`, 
            password: 'something', 
            clientId: `${consumerId}`,
            clean: false
        }; 
        //mqtt://95.211.3.249:1884  mqtt://localhost:1884
        let mqtt_client = mqtt.connect('mqtt://localhost:1884', options)

        mqtt_client.on('connect', function () {
            mqtt_client.subscribe(`/to/${consumerId}/${offeringId}/${agreementId}`, {qos:2})
        });

        mqtt_client.on('message', async(topic, message) => {

            console.log(topic + " " + message.toString())

            if(message.toString().startsWith('{"jws"')){

                console.log(message.toString())
                const pop: nonRepudiationLibrary.StoredProof<nonRepudiationLibrary.PoPPayload> = JSON.parse(message.toString())
                await npConsumer.verifyPoP(pop.jws)

                // Store PoP in wallet
                await consumerWallet.resources.create({
                    type: 'NonRepudiationProof',
                    resource: pop.jws
                })

                const fileName = pop.payload.exchange.cipherblockDgst

                const decryptedBlock = await npConsumer.decrypt()

                console.log(decryptedBlock)
                console.log(String(decryptedBlock))

                const stream = fs.createWriteStream(`./test/${fileName}.json`, { flags: 'a' })

                stream.write(String(decryptedBlock))
                stream.end()

            } else if(message.toString().startsWith('ErrorMessage')){
                console.log(message.toString())
            } else {
                console.log(message.toString())
                const content: StreamResponse = JSON.parse(message.toString())

                await npConsumer.verifyPoO(content.poo, content.cipherBlock)

                // Store PoO in wallet
                await consumerWallet.resources.create({
                    type: 'NonRepudiationProof',
                    resource: content.poo
                })
                const por = await npConsumer.generatePoR()

                // Store PoR in wallet
                await consumerWallet.resources.create({
                    type: 'NonRepudiationProof',
                    resource: por.jws
                })

                mqtt_client.publish(`/from/${consumerId}/${offeringId}/${agreementId}`, JSON.stringify(por.jws), {qos:2})
            }
          })
        console.log(`Mqtt client with id ${consumerId} subscribed to datasource ${offeringId}`)

    } catch (error) {
        if(error instanceof Error){
            console.log(`${error.message}`)
        }
    }
}

streamSubscribe()