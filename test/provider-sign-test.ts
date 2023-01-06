import { ServerWallet, serverWalletBuilder } from "@i3m/server-wallet"
import { WalletApi } from "@i3m/wallet-protocol-api"
import { WalletComponents } from '@i3m/wallet-desktop-openapi/types'
import { HttpInitiatorTransport } from "@i3m/wallet-protocol"
import { parseJwk } from "@i3m/non-repudiation-library"
import * as nonRepudiationLibrary from '@i3m/non-repudiation-library';
import { env } from "../config/env"

const providerJwks = {
    publicJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'gdt9dxd1Q9p5fn8Pch8tuMf6h4lZ_NtbgeVAddPkk5M',
      y: 'coJR5-TGBUwIV_5YovlWzt4suV0wnxfvWJDvekJBCwQ',
      alg: 'ES256'
    },
    privateJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'gdt9dxd1Q9p5fn8Pch8tuMf6h4lZ_NtbgeVAddPkk5M',
      y: 'coJR5-TGBUwIV_5YovlWzt4suV0wnxfvWJDvekJBCwQ',
      d: 'KeFLl9SKwpJHuAmyyxe7YXiCr4cDGK4uMU1fxnrrLjw',
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

async function nrp () {

  let providerOperatorWallet: ServerWallet

  let dataSharingAgreement: WalletComponents.Schemas.DataSharingAgreement

  // Provider info
  //const providerDid = 'did:ethr:i3m:0x02c1e51dbe7fa3c3e89df33495f241316d9554b5206fcef16d8108486285e38c27'

  const keyHex = env.providerDltSigningKeyHex

  // Setup provider wallet
  providerOperatorWallet = await serverWalletBuilder({ password: 'password', reset: true, filepath: './test/wallet' })

  dataSharingAgreement = JSON.parse(JSON.stringify(sharingAgreement))

  //console.log(dataSharingAgreement)

  // Import DLT account
  await providerOperatorWallet.importDid({
    alias: 'provider',
    privateKey: keyHex
   })
   const availableIdentities = await providerOperatorWallet.identityList({ alias: 'provider' })
   
   // The provider DID
   const providerDid = availableIdentities[0]
   console.log(providerDid)
   // The provider address on the DLT
   const providerDltAddress = nonRepudiationLibrary.getDltAddress(keyHex)
   console.log(providerDltAddress)

  const { signatures, ...payload } = dataSharingAgreement

  //console.log(payload)

  //dataSharingAgreement.signatures.providerSignature = (await providerOperatorWallet.identitySign({ did: providerDid.did }, { type: 'JWT', data: { payload } })).signature
  //console.log(dataSharingAgreement.signatures.providerSignature)

  await providerOperatorWallet.resourceCreate({
    type: 'Contract',
    resource: {
      dataSharingAgreement,
      keyPair: {
        publicJwk: await parseJwk(JSON.parse(JSON.stringify(providerJwks.publicJwk)), true),
        privateJwk: await parseJwk(JSON.parse(JSON.stringify(providerJwks.privateJwk)), true)
      }
    }
  })

  const providerDltAgent = new nonRepudiationLibrary.I3mServerWalletAgentOrig(providerOperatorWallet, providerDid.did)

  const dataExchangeAgreement: nonRepudiationLibrary.DataExchangeAgreement = dataSharingAgreement.dataExchangeAgreement

  console.log(dataExchangeAgreement)
  // dataExchangeAgreement.orig = await parseJwk(JSON.parse(JSON.stringify(dataExchangeAgreement.orig)), true)
  // dataExchangeAgreement.dest = await parseJwk(JSON.parse(JSON.stringify(dataExchangeAgreement.dest)), true)

  const providerPrivateKey: nonRepudiationLibrary.JWK = JSON.parse(JSON.stringify(providerJwks.privateJwk))

  const block = 'text'
  const rawBufferData = Buffer.from(block)
  const npProvider = new nonRepudiationLibrary.NonRepudiationProtocol.NonRepudiationOrig(dataExchangeAgreement, providerPrivateKey, rawBufferData, providerDltAgent)

  const poo = await npProvider.generatePoO()

  await providerOperatorWallet.resourceCreate({
    type: 'NonRepudiationProof',
    resource: poo.jws
  })
  console.log(poo)
}

nrp()