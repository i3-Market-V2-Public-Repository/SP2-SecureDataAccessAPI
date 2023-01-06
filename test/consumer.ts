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
      "dataOfferingId": "63aeeed7f762242150a481d1",
      "version": 0,
      "title": "Offering Transport",
      "category": "transport",
      "active": true
    },
    "parties": {
      "providerDid": "did:ethr:i3m:0x02bfe73464de64d6d9a32c99a92356e641ff16427a59b20a95e8d348a60145259a",
      "consumerDid": "did:ethr:i3m:0x037e1117d84099a5763f763960f993956dc17aacd2af06cd8a236584a547ec3fe3"
    },
    "purpose": "",
    "duration": {
      "creationDate": 0,
      "startDate": 0,
      "endDate": 0
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
      "ledgerSignerAddress": "0x65a4e0A143F7DA22427aEca75f4f95eFD8f4aaE2",
      "pooToPorDelay": 100000,
      "pooToPopDelay": 30000,
      "pooToSecretDelay": 180000
    },
    "signatures": {
      "providerSignature": "eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJkYXRhT2ZmZXJpbmdEZXNjcmlwdGlvbiI6eyJkYXRhT2ZmZXJpbmdJZCI6IjYzYWVlZWQ3Zjc2MjI0MjE1MGE0ODFkMSIsInZlcnNpb24iOjAsInRpdGxlIjoiT2ZmZXJpbmcgVHJhbnNwb3J0IiwiY2F0ZWdvcnkiOiJ0cmFuc3BvcnQiLCJhY3RpdmUiOnRydWV9LCJwYXJ0aWVzIjp7InByb3ZpZGVyRGlkIjoiZGlkOmV0aHI6aTNtOjB4MDJiZmU3MzQ2NGRlNjRkNmQ5YTMyYzk5YTkyMzU2ZTY0MWZmMTY0MjdhNTliMjBhOTVlOGQzNDhhNjAxNDUyNTlhIiwiY29uc3VtZXJEaWQiOiJkaWQ6ZXRocjppM206MHgwMzdlMTExN2Q4NDA5OWE1NzYzZjc2Mzk2MGY5OTM5NTZkYzE3YWFjZDJhZjA2Y2Q4YTIzNjU4NGE1NDdlYzNmZTMifSwicHVycG9zZSI6IiIsImR1cmF0aW9uIjp7ImNyZWF0aW9uRGF0ZSI6MCwic3RhcnREYXRlIjowLCJlbmREYXRlIjowfSwiaW50ZW5kZWRVc2UiOnsicHJvY2Vzc0RhdGEiOnRydWUsInNoYXJlRGF0YVdpdGhUaGlyZFBhcnR5Ijp0cnVlLCJlZGl0RGF0YSI6dHJ1ZX0sImxpY2Vuc2VHcmFudCI6eyJ0cmFuc2ZlcmFibGUiOnRydWUsImV4Y2x1c2l2ZW5lc3MiOnRydWUsInBhaWRVcCI6dHJ1ZSwicmV2b2NhYmxlIjp0cnVlLCJwcm9jZXNzaW5nIjp0cnVlLCJtb2RpZnlpbmciOnRydWUsImFuYWx5emluZyI6dHJ1ZSwic3RvcmluZ0RhdGEiOnRydWUsInN0b3JpbmdDb3B5Ijp0cnVlLCJyZXByb2R1Y2luZyI6dHJ1ZSwiZGlzdHJpYnV0aW5nIjp0cnVlLCJsb2FuaW5nIjp0cnVlLCJzZWxsaW5nIjp0cnVlLCJyZW50aW5nIjp0cnVlLCJmdXJ0aGVyTGljZW5zaW5nIjp0cnVlLCJsZWFzaW5nIjp0cnVlfSwiZGF0YVN0cmVhbSI6ZmFsc2UsInBlcnNvbmFsRGF0YSI6ZmFsc2UsInByaWNpbmdNb2RlbCI6eyJwYXltZW50VHlwZSI6Im9uZS10aW1lIHB1cmNoYXNlIiwicHJpY2luZ01vZGVsTmFtZSI6InN0cmluZyIsImJhc2ljUHJpY2UiOjAsImN1cnJlbmN5IjoiRVVSIiwiZmVlIjpudWxsLCJoYXNQYXltZW50T25TdWJzY3JpcHRpb24iOnsicGF5bWVudE9uU3Vic2NyaXB0aW9uTmFtZSI6IiIsInBheW1lbnRUeXBlIjoiIiwidGltZUR1cmF0aW9uIjoiIiwiZGVzY3JpcHRpb24iOiIiLCJyZXBlYXQiOiIiLCJoYXNTdWJzY3JpcHRpb25QcmljZSI6MH0sImhhc0ZyZWVQcmljZSI6eyJoYXNQcmljZUZyZWUiOnRydWV9fSwiZGF0YUV4Y2hhbmdlQWdyZWVtZW50Ijp7Im9yaWciOiJ7XCJhbGdcIjpcIkVTMjU2XCIsXCJjcnZcIjpcIlAtMjU2XCIsXCJrdHlcIjpcIkVDXCIsXCJ4XCI6XCJnZHQ5ZHhkMVE5cDVmbjhQY2g4dHVNZjZoNGxaX050YmdlVkFkZFBrazVNXCIsXCJ5XCI6XCJjb0pSNS1UR0JVd0lWXzVZb3ZsV3p0NHN1VjB3bnhmdldKRHZla0pCQ3dRXCJ9IiwiZGVzdCI6IntcImFsZ1wiOlwiRVMyNTZcIixcImNydlwiOlwiUC0yNTZcIixcImt0eVwiOlwiRUNcIixcInhcIjpcIllJMjhndlYwdXRtdmpvYktuZWRfNG02M2JjMlNrSnVLeEpCbGxBTmZLVWNcIixcInlcIjpcIkpNS3pUeHhlNGpOY29aWU80RDdYZV9ublp0S2VaeTV6X0ptcWpvVXlMZjhcIn0iLCJlbmNBbGciOiJBMTI4R0NNIiwic2lnbmluZ0FsZyI6IkVTMjU2IiwiaGFzaEFsZyI6IlNIQS0yNTYiLCJsZWRnZXJDb250cmFjdEFkZHJlc3MiOiIweDhkNDA3QTE3MjI2MzNiREQxZGNmMjIxNDc0YmU3YTQ0QzA1ZDdjMkYiLCJsZWRnZXJTaWduZXJBZGRyZXNzIjoiMHg2NWE0ZTBBMTQzRjdEQTIyNDI3YUVjYTc1ZjRmOTVlRkQ4ZjRhYUUyIiwicG9vVG9Qb3JEZWxheSI6MTAwMDAwLCJwb29Ub1BvcERlbGF5IjozMDAwMCwicG9vVG9TZWNyZXREZWxheSI6MTgwMDAwfSwiaXNzIjoiZGlkOmV0aHI6aTNtOjB4MDJiZmU3MzQ2NGRlNjRkNmQ5YTMyYzk5YTkyMzU2ZTY0MWZmMTY0MjdhNTliMjBhOTVlOGQzNDhhNjAxNDUyNTlhIiwiaWF0IjoxNjcyNDA5MzU5fQ.bWu9zv3MpH_IG0xG1mgufS7U5Hjnp_Z7A42CvWYDqep-V5aKHGH03CMinAM_8gZohGIGauxLDMEcD3NW6mge1A",
      "consumerSignature": "eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJkYXRhT2ZmZXJpbmdEZXNjcmlwdGlvbiI6eyJkYXRhT2ZmZXJpbmdJZCI6IjYzYWVlZWQ3Zjc2MjI0MjE1MGE0ODFkMSIsInZlcnNpb24iOjAsInRpdGxlIjoiT2ZmZXJpbmcgVHJhbnNwb3J0IiwiY2F0ZWdvcnkiOiJ0cmFuc3BvcnQiLCJhY3RpdmUiOnRydWV9LCJwYXJ0aWVzIjp7InByb3ZpZGVyRGlkIjoiZGlkOmV0aHI6aTNtOjB4MDJiZmU3MzQ2NGRlNjRkNmQ5YTMyYzk5YTkyMzU2ZTY0MWZmMTY0MjdhNTliMjBhOTVlOGQzNDhhNjAxNDUyNTlhIiwiY29uc3VtZXJEaWQiOiJkaWQ6ZXRocjppM206MHgwMzdlMTExN2Q4NDA5OWE1NzYzZjc2Mzk2MGY5OTM5NTZkYzE3YWFjZDJhZjA2Y2Q4YTIzNjU4NGE1NDdlYzNmZTMifSwicHVycG9zZSI6IiIsImR1cmF0aW9uIjp7ImNyZWF0aW9uRGF0ZSI6MCwic3RhcnREYXRlIjowLCJlbmREYXRlIjowfSwiaW50ZW5kZWRVc2UiOnsicHJvY2Vzc0RhdGEiOnRydWUsInNoYXJlRGF0YVdpdGhUaGlyZFBhcnR5Ijp0cnVlLCJlZGl0RGF0YSI6dHJ1ZX0sImxpY2Vuc2VHcmFudCI6eyJ0cmFuc2ZlcmFibGUiOnRydWUsImV4Y2x1c2l2ZW5lc3MiOnRydWUsInBhaWRVcCI6dHJ1ZSwicmV2b2NhYmxlIjp0cnVlLCJwcm9jZXNzaW5nIjp0cnVlLCJtb2RpZnlpbmciOnRydWUsImFuYWx5emluZyI6dHJ1ZSwic3RvcmluZ0RhdGEiOnRydWUsInN0b3JpbmdDb3B5Ijp0cnVlLCJyZXByb2R1Y2luZyI6dHJ1ZSwiZGlzdHJpYnV0aW5nIjp0cnVlLCJsb2FuaW5nIjp0cnVlLCJzZWxsaW5nIjp0cnVlLCJyZW50aW5nIjp0cnVlLCJmdXJ0aGVyTGljZW5zaW5nIjp0cnVlLCJsZWFzaW5nIjp0cnVlfSwiZGF0YVN0cmVhbSI6ZmFsc2UsInBlcnNvbmFsRGF0YSI6ZmFsc2UsInByaWNpbmdNb2RlbCI6eyJwYXltZW50VHlwZSI6Im9uZS10aW1lIHB1cmNoYXNlIiwicHJpY2luZ01vZGVsTmFtZSI6InN0cmluZyIsImJhc2ljUHJpY2UiOjAsImN1cnJlbmN5IjoiRVVSIiwiZmVlIjpudWxsLCJoYXNQYXltZW50T25TdWJzY3JpcHRpb24iOnsicGF5bWVudE9uU3Vic2NyaXB0aW9uTmFtZSI6IiIsInBheW1lbnRUeXBlIjoiIiwidGltZUR1cmF0aW9uIjoiIiwiZGVzY3JpcHRpb24iOiIiLCJyZXBlYXQiOiIiLCJoYXNTdWJzY3JpcHRpb25QcmljZSI6MH0sImhhc0ZyZWVQcmljZSI6eyJoYXNQcmljZUZyZWUiOnRydWV9fSwiZGF0YUV4Y2hhbmdlQWdyZWVtZW50Ijp7Im9yaWciOiJ7XCJhbGdcIjpcIkVTMjU2XCIsXCJjcnZcIjpcIlAtMjU2XCIsXCJrdHlcIjpcIkVDXCIsXCJ4XCI6XCJnZHQ5ZHhkMVE5cDVmbjhQY2g4dHVNZjZoNGxaX050YmdlVkFkZFBrazVNXCIsXCJ5XCI6XCJjb0pSNS1UR0JVd0lWXzVZb3ZsV3p0NHN1VjB3bnhmdldKRHZla0pCQ3dRXCJ9IiwiZGVzdCI6IntcImFsZ1wiOlwiRVMyNTZcIixcImNydlwiOlwiUC0yNTZcIixcImt0eVwiOlwiRUNcIixcInhcIjpcIllJMjhndlYwdXRtdmpvYktuZWRfNG02M2JjMlNrSnVLeEpCbGxBTmZLVWNcIixcInlcIjpcIkpNS3pUeHhlNGpOY29aWU80RDdYZV9ublp0S2VaeTV6X0ptcWpvVXlMZjhcIn0iLCJlbmNBbGciOiJBMTI4R0NNIiwic2lnbmluZ0FsZyI6IkVTMjU2IiwiaGFzaEFsZyI6IlNIQS0yNTYiLCJsZWRnZXJDb250cmFjdEFkZHJlc3MiOiIweDhkNDA3QTE3MjI2MzNiREQxZGNmMjIxNDc0YmU3YTQ0QzA1ZDdjMkYiLCJsZWRnZXJTaWduZXJBZGRyZXNzIjoiMHg2NWE0ZTBBMTQzRjdEQTIyNDI3YUVjYTc1ZjRmOTVlRkQ4ZjRhYUUyIiwicG9vVG9Qb3JEZWxheSI6MTAwMDAwLCJwb29Ub1BvcERlbGF5IjozMDAwMCwicG9vVG9TZWNyZXREZWxheSI6MTgwMDAwfSwiaXNzIjoiZGlkOmV0aHI6aTNtOjB4MDM3ZTExMTdkODQwOTlhNTc2M2Y3NjM5NjBmOTkzOTU2ZGMxN2FhY2QyYWYwNmNkOGEyMzY1ODRhNTQ3ZWMzZmUzIiwiaWF0IjoxNjcyNDA5MzE0fQ.hY0a5JlTQt6ObhGZeqN8ci8437sUd-agndQnTOpfLyIi1ZExqthoKaTVwB2MXfORopNGpCqr2zkzlCXABLvq-A"
    }
}

import { parseJwk } from '@i3m/non-repudiation-library'
import { HttpInitiatorTransport, Session } from '@i3m/wallet-protocol'
import { WalletApi } from '@i3m/wallet-protocol-api'
import { WalletComponents } from '@i3m/wallet-desktop-openapi/types'

async function nrp () {

    const sessionObj = JSON.parse(JSON.stringify({"masterKey":{"from":{"name":"Initiator"},"to":{"name":"Wallet desktop"},"port":29170,"na":"rjNlGN2yicmzghm4uf2HEg","nb":"Ur5M-HIeuQncEWsLzATAZA","secret":"onQ0WzIamp30lGLU-XBIxV-MUNVKxtHbCSqLLD83z9o"},"code":"65794a68624763694f694a6b615849694c434a6c626d4d694f694a424d6a553252304e4e496e302e2e77743438556751305a7a686e695043742e3654305057786e554f4458337630327957356633334b784f796c4550766261414d5a325f4b4c533074517839415671596c3058506535647142425633643077715f48464c446e46316352317650335230487765625346494d3156396b53547277726d5f592d37324278476d4836414d744652495a5070714a425359636a3155734f4a6b656235514b53347332324d386f734a7952477234526c5f584d78385231505a7a4133455641746f2d48483476395461756977794b3354485046337761374f5f6f617872454c4d4647326b424c474559705033617038427a4e777359596c31726c4663617874303369743845344f5a5242322d75514a6c564f4648316d5844456e4358336a736432532d7a4e3043794675762d32794266414d4938437041485f7045755f6e6a5a7154596f73485555534747664e334c514179785645745f6e54506f6949346937587a7a3737714b514752316948536d5239556d73596748504b4e5031724744706551724b476341634c506c735f4a4f465a505166412e4d75643232506432434d7266465a776e2d314c474877"}))

    let consumerWallet: WalletApi

    console.log(sessionObj)
    // Setup consumer wallet
    const transport = new HttpInitiatorTransport()
    console.log(1)
    const session = await Session.fromJSON(transport, sessionObj)
    console.log(2)
    consumerWallet = new WalletApi(session)
    console.log(3)
    const identityList = consumerWallet.identities.list()

    console.log(identityList)

    // let dataSharingAgreement: WalletComponents.Schemas.DataSharingAgreement
    // dataSharingAgreement = await import('../test/dataSharingAgreement.json') as WalletComponents.Schemas.DataSharingAgreement

    // const consumerDid = 'did:ethr:i3m:0x037e1117d84099a5763f763960f993956dc17aacd2af06cd8a236584a547ec3fe3'

    // // consumer stores agreement
    // const resource1 = await consumerWallet.resources.create({
    //   type: 'Contract',
    //   identity: consumerDid,
    //   resource: {
    //     dataSharingAgreement,
    //     keyPair: {
    //       publicJwk: await parseJwk(JSON.parse(JSON.stringify(consumerJwks.publicJwk)), true),
    //       privateJwk: await parseJwk(JSON.parse(JSON.stringify(consumerJwks.privateJwk)), true)
    //     }
    //   }
    // })

    // console.log(resource1)
}

nrp()

