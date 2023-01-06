import * as nonRepudiationLibrary from '@i3m/non-repudiation-library';
import * as fs from 'fs';
import { env } from '../config/env';
import 'isomorphic-fetch';
import { HttpInitiatorTransport, Session } from '@i3m/wallet-protocol'
import { WalletApi } from '@i3m/wallet-protocol-api'

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
      "dataOfferingId": "63b55691f762242150a481d3",
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
      "creationDate": 	1672824609,
      "startDate": 	1672824609,
      "endDate": 1704360609
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
    "dataStream": false,
    "personalData": false,
    "pricingModel": {
      "paymentType": "one-time purchase",
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
      "pooToPorDelay": 100000,
      "pooToPopDelay": 30000,
      "pooToSecretDelay": 180000
    },
    "signatures": {
      "providerSignature": "eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJkYXRhT2ZmZXJpbmdEZXNjcmlwdGlvbiI6eyJkYXRhT2ZmZXJpbmdJZCI6IjYzYjU1NjkxZjc2MjI0MjE1MGE0ODFkMyIsInZlcnNpb24iOjAsInRpdGxlIjoiT2ZmZXJpbmcgVHJhbnNwb3J0IiwiY2F0ZWdvcnkiOiJ0cmFuc3BvcnQiLCJhY3RpdmUiOnRydWV9LCJwYXJ0aWVzIjp7InByb3ZpZGVyRGlkIjoiZGlkOmV0aHI6aTNtOjB4MDM0Mzc3NzA5NjA1OTVkOWQxY2NkNzNjNWRmMTVkNjg4YjdkYjhlYzk2NTY3ZGYwMDBmZGZlZmZhNDFkZWY2NzVmIiwiY29uc3VtZXJEaWQiOiJkaWQ6ZXRocjppM206MHgwMzdlMTExN2Q4NDA5OWE1NzYzZjc2Mzk2MGY5OTM5NTZkYzE3YWFjZDJhZjA2Y2Q4YTIzNjU4NGE1NDdlYzNmZTMifSwicHVycG9zZSI6IiIsImR1cmF0aW9uIjp7ImNyZWF0aW9uRGF0ZSI6MTY3MjgyNDYwOSwic3RhcnREYXRlIjoxNjcyODI0NjA5LCJlbmREYXRlIjoxNzA0MzYwNjA5fSwiaW50ZW5kZWRVc2UiOnsicHJvY2Vzc0RhdGEiOnRydWUsInNoYXJlRGF0YVdpdGhUaGlyZFBhcnR5Ijp0cnVlLCJlZGl0RGF0YSI6dHJ1ZX0sImxpY2Vuc2VHcmFudCI6eyJ0cmFuc2ZlcmFibGUiOnRydWUsImV4Y2x1c2l2ZW5lc3MiOnRydWUsInBhaWRVcCI6dHJ1ZSwicmV2b2NhYmxlIjp0cnVlLCJwcm9jZXNzaW5nIjp0cnVlLCJtb2RpZnlpbmciOnRydWUsImFuYWx5emluZyI6dHJ1ZSwic3RvcmluZ0RhdGEiOnRydWUsInN0b3JpbmdDb3B5Ijp0cnVlLCJyZXByb2R1Y2luZyI6dHJ1ZSwiZGlzdHJpYnV0aW5nIjp0cnVlLCJsb2FuaW5nIjp0cnVlLCJzZWxsaW5nIjp0cnVlLCJyZW50aW5nIjp0cnVlLCJmdXJ0aGVyTGljZW5zaW5nIjp0cnVlLCJsZWFzaW5nIjp0cnVlfSwiZGF0YVN0cmVhbSI6ZmFsc2UsInBlcnNvbmFsRGF0YSI6ZmFsc2UsInByaWNpbmdNb2RlbCI6eyJwYXltZW50VHlwZSI6Im9uZS10aW1lIHB1cmNoYXNlIiwicHJpY2luZ01vZGVsTmFtZSI6InN0cmluZyIsImJhc2ljUHJpY2UiOjAsImN1cnJlbmN5IjoiRVVSIiwiZmVlIjowLCJoYXNQYXltZW50T25TdWJzY3JpcHRpb24iOnsicGF5bWVudE9uU3Vic2NyaXB0aW9uTmFtZSI6IiIsInBheW1lbnRUeXBlIjoiIiwidGltZUR1cmF0aW9uIjoiIiwiZGVzY3JpcHRpb24iOiIiLCJyZXBlYXQiOiIiLCJoYXNTdWJzY3JpcHRpb25QcmljZSI6MH0sImhhc0ZyZWVQcmljZSI6eyJoYXNQcmljZUZyZWUiOnRydWV9fSwiZGF0YUV4Y2hhbmdlQWdyZWVtZW50Ijp7Im9yaWciOiJ7XCJhbGdcIjpcIkVTMjU2XCIsXCJjcnZcIjpcIlAtMjU2XCIsXCJrdHlcIjpcIkVDXCIsXCJ4XCI6XCJnZHQ5ZHhkMVE5cDVmbjhQY2g4dHVNZjZoNGxaX050YmdlVkFkZFBrazVNXCIsXCJ5XCI6XCJjb0pSNS1UR0JVd0lWXzVZb3ZsV3p0NHN1VjB3bnhmdldKRHZla0pCQ3dRXCJ9IiwiZGVzdCI6IntcImFsZ1wiOlwiRVMyNTZcIixcImNydlwiOlwiUC0yNTZcIixcImt0eVwiOlwiRUNcIixcInhcIjpcIllJMjhndlYwdXRtdmpvYktuZWRfNG02M2JjMlNrSnVLeEpCbGxBTmZLVWNcIixcInlcIjpcIkpNS3pUeHhlNGpOY29aWU80RDdYZV9ublp0S2VaeTV6X0ptcWpvVXlMZjhcIn0iLCJlbmNBbGciOiJBMTI4R0NNIiwic2lnbmluZ0FsZyI6IkVTMjU2IiwiaGFzaEFsZyI6IlNIQS0yNTYiLCJsZWRnZXJDb250cmFjdEFkZHJlc3MiOiIweDhkNDA3QTE3MjI2MzNiREQxZGNmMjIxNDc0YmU3YTQ0QzA1ZDdjMkYiLCJsZWRnZXJTaWduZXJBZGRyZXNzIjoiMHhkQjBDRTY4YkFiQzE0NUIxODc4NkMyRDgyMEI4Q2NDYzQwZTFhNGY1IiwicG9vVG9Qb3JEZWxheSI6MTAwMDAwLCJwb29Ub1BvcERlbGF5IjozMDAwMCwicG9vVG9TZWNyZXREZWxheSI6MTgwMDAwfSwiaXNzIjoiZGlkOmV0aHI6aTNtOjB4MDM0Mzc3NzA5NjA1OTVkOWQxY2NkNzNjNWRmMTVkNjg4YjdkYjhlYzk2NTY3ZGYwMDBmZGZlZmZhNDFkZWY2NzVmIiwiaWF0IjoxNjcyODMyOTAyfQ.lFyYmVy8q9iwN1_I_ThEKCaSiEHVkV21rwl_jRuX9c9khpUwpd7dQtOKvNl_kms-ITd9lQl2aPNuxzliUNHqVQ",
      "consumerSignature": "eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJkYXRhT2ZmZXJpbmdEZXNjcmlwdGlvbiI6eyJkYXRhT2ZmZXJpbmdJZCI6IjYzYjU1NjkxZjc2MjI0MjE1MGE0ODFkMyIsInZlcnNpb24iOjAsInRpdGxlIjoiT2ZmZXJpbmcgVHJhbnNwb3J0IiwiY2F0ZWdvcnkiOiJ0cmFuc3BvcnQiLCJhY3RpdmUiOnRydWV9LCJwYXJ0aWVzIjp7InByb3ZpZGVyRGlkIjoiZGlkOmV0aHI6aTNtOjB4MDM0Mzc3NzA5NjA1OTVkOWQxY2NkNzNjNWRmMTVkNjg4YjdkYjhlYzk2NTY3ZGYwMDBmZGZlZmZhNDFkZWY2NzVmIiwiY29uc3VtZXJEaWQiOiJkaWQ6ZXRocjppM206MHgwMzdlMTExN2Q4NDA5OWE1NzYzZjc2Mzk2MGY5OTM5NTZkYzE3YWFjZDJhZjA2Y2Q4YTIzNjU4NGE1NDdlYzNmZTMifSwicHVycG9zZSI6IiIsImR1cmF0aW9uIjp7ImNyZWF0aW9uRGF0ZSI6MTY3MjgyNDYwOSwic3RhcnREYXRlIjoxNjcyODI0NjA5LCJlbmREYXRlIjoxNzA0MzYwNjA5fSwiaW50ZW5kZWRVc2UiOnsicHJvY2Vzc0RhdGEiOnRydWUsInNoYXJlRGF0YVdpdGhUaGlyZFBhcnR5Ijp0cnVlLCJlZGl0RGF0YSI6dHJ1ZX0sImxpY2Vuc2VHcmFudCI6eyJ0cmFuc2ZlcmFibGUiOnRydWUsImV4Y2x1c2l2ZW5lc3MiOnRydWUsInBhaWRVcCI6dHJ1ZSwicmV2b2NhYmxlIjp0cnVlLCJwcm9jZXNzaW5nIjp0cnVlLCJtb2RpZnlpbmciOnRydWUsImFuYWx5emluZyI6dHJ1ZSwic3RvcmluZ0RhdGEiOnRydWUsInN0b3JpbmdDb3B5Ijp0cnVlLCJyZXByb2R1Y2luZyI6dHJ1ZSwiZGlzdHJpYnV0aW5nIjp0cnVlLCJsb2FuaW5nIjp0cnVlLCJzZWxsaW5nIjp0cnVlLCJyZW50aW5nIjp0cnVlLCJmdXJ0aGVyTGljZW5zaW5nIjp0cnVlLCJsZWFzaW5nIjp0cnVlfSwiZGF0YVN0cmVhbSI6ZmFsc2UsInBlcnNvbmFsRGF0YSI6ZmFsc2UsInByaWNpbmdNb2RlbCI6eyJwYXltZW50VHlwZSI6Im9uZS10aW1lIHB1cmNoYXNlIiwicHJpY2luZ01vZGVsTmFtZSI6InN0cmluZyIsImJhc2ljUHJpY2UiOjAsImN1cnJlbmN5IjoiRVVSIiwiZmVlIjowLCJoYXNQYXltZW50T25TdWJzY3JpcHRpb24iOnsicGF5bWVudE9uU3Vic2NyaXB0aW9uTmFtZSI6IiIsInBheW1lbnRUeXBlIjoiIiwidGltZUR1cmF0aW9uIjoiIiwiZGVzY3JpcHRpb24iOiIiLCJyZXBlYXQiOiIiLCJoYXNTdWJzY3JpcHRpb25QcmljZSI6MH0sImhhc0ZyZWVQcmljZSI6eyJoYXNQcmljZUZyZWUiOnRydWV9fSwiZGF0YUV4Y2hhbmdlQWdyZWVtZW50Ijp7Im9yaWciOiJ7XCJhbGdcIjpcIkVTMjU2XCIsXCJjcnZcIjpcIlAtMjU2XCIsXCJrdHlcIjpcIkVDXCIsXCJ4XCI6XCJnZHQ5ZHhkMVE5cDVmbjhQY2g4dHVNZjZoNGxaX050YmdlVkFkZFBrazVNXCIsXCJ5XCI6XCJjb0pSNS1UR0JVd0lWXzVZb3ZsV3p0NHN1VjB3bnhmdldKRHZla0pCQ3dRXCJ9IiwiZGVzdCI6IntcImFsZ1wiOlwiRVMyNTZcIixcImNydlwiOlwiUC0yNTZcIixcImt0eVwiOlwiRUNcIixcInhcIjpcIllJMjhndlYwdXRtdmpvYktuZWRfNG02M2JjMlNrSnVLeEpCbGxBTmZLVWNcIixcInlcIjpcIkpNS3pUeHhlNGpOY29aWU80RDdYZV9ublp0S2VaeTV6X0ptcWpvVXlMZjhcIn0iLCJlbmNBbGciOiJBMTI4R0NNIiwic2lnbmluZ0FsZyI6IkVTMjU2IiwiaGFzaEFsZyI6IlNIQS0yNTYiLCJsZWRnZXJDb250cmFjdEFkZHJlc3MiOiIweDhkNDA3QTE3MjI2MzNiREQxZGNmMjIxNDc0YmU3YTQ0QzA1ZDdjMkYiLCJsZWRnZXJTaWduZXJBZGRyZXNzIjoiMHhkQjBDRTY4YkFiQzE0NUIxODc4NkMyRDgyMEI4Q2NDYzQwZTFhNGY1IiwicG9vVG9Qb3JEZWxheSI6MTAwMDAwLCJwb29Ub1BvcERlbGF5IjozMDAwMCwicG9vVG9TZWNyZXREZWxheSI6MTgwMDAwfSwiaXNzIjoiZGlkOmV0aHI6aTNtOjB4MDM3ZTExMTdkODQwOTlhNTc2M2Y3NjM5NjBmOTkzOTU2ZGMxN2FhY2QyYWYwNmNkOGEyMzY1ODRhNTQ3ZWMzZmUzIiwiaWF0IjoxNjcyODMyMDk5fQ.LlUyaZZDPbzxFoX-sQvhUkLI0SGSEfuDjbi9UYEV4Q5zHOiBi9YxPCBJi8M8tAp2QD95HOZSp_zZ2B8za0RD_w"
    }
  }

// Info needed to make a request for batch
const bearerToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIwLjAuMC4wIiwiYXVkIjoiMC4wLjAuMCIsImV4cCI6MTY2ODY5MDcyNiwic3ViIjoiZGlkOmV0aHI6aTNtOjB4MDNlZGRjYzU0YmZiZGNlNGZiZDU5OGY0ODI3MzUxZmViMjMxMGQwMDVmYjFkNTMxNDVlNjc4N2QwYTZmN2IwZjVmIiwic2NvcGUiOiJvcGVuaWQgdmMgdmNlOmNvbnN1bWVyIiwiaWF0IjoxNjY4NjA0MzI2fQ.xnGXN3H754Hz1Y7bdJgmxTxSY59imspJLDmTwq6VUkQ"
const agreementId = 17
const data = "exampledata.7z"
let blockId = "null"
let blockAck = "null"

// Example how to retrieve a block of data
const oneBlock = async () => {

    const content = await requestData(data, agreementId, bearerToken, blockId, blockAck)

    const sessionObj = JSON.parse('{"masterKey":{"from":{"name":"Initiator"},"to":{"name":"Wallet desktop"},"port":29170,"na":"bto0GtBh9KjvG8PRRySTGQ","nb":"Q1oHivusP5DuV0hXhe8IdA","secret":"3AiI59_DJZNbgLFy0W4EUc7srnsOwSidlWp8ayzyP78"},"code":"65794a68624763694f694a6b615849694c434a6c626d4d694f694a424d6a553252304e4e496e302e2e68717036594c42372d654f786857724e2e762d3032305f752d684a625f664b776e74754e774c6f304f4742735a35536a6f2d4d4e422d6e62776d6558554d56515a54684b434f36327a4e5151636f5738634a42693850634437525a316c5231496b37776b4634366a586f7a785a4633597432387a546452656b45574d706a6c444351565061544f4a67434c5a6561544b5875784a6f756c7050686b5a794536385f7a582d6e37626c2d68564732706a635a4e69587a704730616a654e4a7961754f464a6a70657a696a45646764764f767a5f453167646a486e64697862716273307a6b597478753649735f654f675f705876466b4279784d326b6b64595468355a4f586573363831706f74775062376c6f4d7662615f465076545f38566d50724f63535441566a52556c432d6341745f5171677147616338776f4a37626a4e6a792d5471665f6142666b324d78337932713355676371567159332d776230683571484b553636583336706c39706f6b486b4368576b31654276436a4d4e41523671487a596c30667537626a4c4b43772e73756e4c776e6e33437648775438612d324b4c364841"}')
    
    // Setup consumer wallet
    const transport = new HttpInitiatorTransport()
    const session = await Session.fromJSON(transport, sessionObj)
    const consumerWallet = new WalletApi(session)

    // Select an identity to use. In this example we get the one with alias set to 'consumer'
    const availableIdentities = await consumerWallet.identities.list()

    // The consumer DID
    const consumerDid = availableIdentities[0]

    const consumerDltAgent = new nonRepudiationLibrary.I3mWalletAgentDest(consumerWallet, consumerDid.did)

    const dataSharingAgreement = JSON.parse(JSON.stringify(sharingAgreement))
    const dataExchangeAgreement: nonRepudiationLibrary.DataExchangeAgreement = dataSharingAgreement.dataExchangeAgreement
    const consumerPrivateKey: nonRepudiationLibrary.JWK = JSON.parse(JSON.stringify(consumerJwks.privateJwk))
    
    if (content.poo != 'null') {
        const poo = content.poo

        const npConsumer = new nonRepudiationLibrary.NonRepudiationProtocol.NonRepudiationDest(dataExchangeAgreement, consumerPrivateKey, consumerDltAgent)

        await npConsumer.verifyPoO(poo, content.cipherBlock)
        console.log('The poo is valid')

        // Store PoO in wallet
        await consumerWallet.resources.create({
            type: 'NonRepudiationProof',
            resource: poo
        })

        const por = await npConsumer.generatePoR()
        console.log("The por is: " + JSON.stringify(por))

        // Store PoR in wallet
        await consumerWallet.resources.create({
            type: 'NonRepudiationProof',
            resource: por.jws
        })

        let pop = await requestPop(bearerToken, por)
        console.log("The pop is: " + JSON.stringify(pop))

        await npConsumer.verifyPoP(pop.jws)

        // Store PoP in wallet
        await consumerWallet.resources.create({
            type: 'NonRepudiationProof',
            resource: pop.jws
        })

        const decryptedBlock = await npConsumer.decrypt()
        console.log(decryptedBlock)

    }
}

oneBlock()

// Example how to retrieve and recreate an entire file
const oneFile = async () => {

    let check_eof = true

    let stream = fs.createWriteStream(`./${data}`, { flags: 'a' })

    const content = await requestData(data, agreementId, bearerToken, blockId, blockAck)

    const sessionObj = JSON.parse('{"masterKey":{"from":{"name":"Initiator"},"to":{"name":"Wallet desktop"},"port":29170,"na":"bto0GtBh9KjvG8PRRySTGQ","nb":"Q1oHivusP5DuV0hXhe8IdA","secret":"3AiI59_DJZNbgLFy0W4EUc7srnsOwSidlWp8ayzyP78"},"code":"65794a68624763694f694a6b615849694c434a6c626d4d694f694a424d6a553252304e4e496e302e2e68717036594c42372d654f786857724e2e762d3032305f752d684a625f664b776e74754e774c6f304f4742735a35536a6f2d4d4e422d6e62776d6558554d56515a54684b434f36327a4e5151636f5738634a42693850634437525a316c5231496b37776b4634366a586f7a785a4633597432387a546452656b45574d706a6c444351565061544f4a67434c5a6561544b5875784a6f756c7050686b5a794536385f7a582d6e37626c2d68564732706a635a4e69587a704730616a654e4a7961754f464a6a70657a696a45646764764f767a5f453167646a486e64697862716273307a6b597478753649735f654f675f705876466b4279784d326b6b64595468355a4f586573363831706f74775062376c6f4d7662615f465076545f38566d50724f63535441566a52556c432d6341745f5171677147616338776f4a37626a4e6a792d5471665f6142666b324d78337932713355676371567159332d776230683571484b553636583336706c39706f6b486b4368576b31654276436a4d4e41523671487a596c30667537626a4c4b43772e73756e4c776e6e33437648775438612d324b4c364841"}')
    
    // Setup consumer wallet
    const transport = new HttpInitiatorTransport()
    const session = await Session.fromJSON(transport, sessionObj)
    const consumerWallet = new WalletApi(session)

    // Select an identity to use. In this example we get the one with alias set to 'consumer'
    const availableIdentities = await consumerWallet.identities.list()

    // The consumer DID
    const consumerDid = availableIdentities[0]

    const consumerDltAgent = new nonRepudiationLibrary.I3mWalletAgentDest(consumerWallet, consumerDid.did)

    const dataSharingAgreement = JSON.parse(JSON.stringify(sharingAgreement))
    const dataExchangeAgreement: nonRepudiationLibrary.DataExchangeAgreement = dataSharingAgreement.dataExchangeAgreement
    const consumerPrivateKey: nonRepudiationLibrary.JWK = JSON.parse(JSON.stringify(consumerJwks.privateJwk))

    while (check_eof) {

        let content = await requestData(data, agreementId, bearerToken, blockId, blockAck)

        console.log(content)

        if (content.poo != 'null') {

            const poo = content.poo

            const npConsumer = new nonRepudiationLibrary.NonRepudiationProtocol.NonRepudiationDest(dataExchangeAgreement, consumerPrivateKey, consumerDltAgent)

            await npConsumer.verifyPoO(poo, content.cipherBlock)
            console.log('The poo is valid')

            // Store PoO in wallet
            await consumerWallet.resources.create({
                type: 'NonRepudiationProof',
                resource: poo
            })

            const por = await npConsumer.generatePoR()
            console.log("The por is: " + JSON.stringify(por))

            // Store PoR in wallet
            await consumerWallet.resources.create({
                type: 'NonRepudiationProof',
                resource: por.jws
            })

            let resp = await requestPop(bearerToken, por)
            console.log("The pop is: " + JSON.stringify(resp))

            await npConsumer.verifyPoP(resp.pop)

            // Store PoP in wallet
            await consumerWallet.resources.create({
                type: 'NonRepudiationProof',
                resource: resp.pop
            })

            const decryptedBlock = await npConsumer.decrypt()
            console.log(decryptedBlock)

            stream.write(decryptedBlock)
        }
        blockId = content.nextBlockId
        blockAck = content.blockId

        if (content.nextBlockId == "null" && blockAck == "null") {
            check_eof = false
            stream.end()
            console.log("File imported")
        }
    }
}

oneFile()

// Helper functions
async function requestPop(bearerToken: string, por: nonRepudiationLibrary.StoredProof<nonRepudiationLibrary.PoRPayload>) {
    const sendPor = await fetch(`${env.publicUri}/batch/pop`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({ por: por.jws }),
    })
    const pop = await sendPor.json()
    console.log(JSON.stringify(pop))
    return pop
}

async function requestData(data: string, agreementId: number, bearerToken: string, blockId: string, blockAck: string) {
    const resource = await fetch(`${env.publicUri}/` + `batch/${data}/${agreementId}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({ blockId: blockId, blockAck: blockAck }),
    })
    const content: Content = await resource.json()
    console.log(content.poo)
    return content
}

// Interfaces
interface Content {
    blockId: string,
    nextBlockId: string,
    poo: string,
    cipherBlock: string,
    transactionObject?: object
}