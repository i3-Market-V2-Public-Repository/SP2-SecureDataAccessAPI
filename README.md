# 1. Introduction

The secure data access api is the component which facilitates the data transfer between the consumer and the provider.
Secure Data Access API enables data providers secured registration and consumers verification to access and/or exchange data in a peer-to-peer fashion, once the contracts and security mechanisms for identity management have been confirmed and executed. This improves scalability and avoids the need that data providers have to share their data assets with intermediaries (e.g. a marketplace provider).

For more architectural details check out this [documentation](https://wiki.ct.siemens.de/display/i3marketExt/Data+Access+API+-+Design)

### Data Management

Two methods for data transfer are supported by Data Access API which are supported by the following modules:

+ Batch Data Transfer Management
One time data transfer for one chunk of data in a session with the following methods:

    - Request data

    - Transfer data

+ Data Stream Management
Continuous transfer of data based on a subscription, e.g. publish/subscribe mechanism:

    - Subscribe to an offering

    - Trigger data transfer – on the producer side

    - Get data – on the consumer side

    - Unsubscribe

# 2. Run Secure Data Access API using docker-compose

[Here](https://gitlab.com/i3-market/code/sp2/secure-data-access-api) is the data access api project repository.

* Clone the repository.
```
git clone git@gitlab.com:i3-market/code/sp2/secure-data-access-api. 
```
* In the project root create a .env file to insert environment variables. You have an example in templates/template.env
* To start Secure Data Access API run with this command:
```
docker-compose up --build
```
# 3. Prerequisits

## <mark>For provider<mark>
* Before the consumer can transfer data using the secure data access api, there has to be a contractual agreement between the consumer and the provider. In the flow to reach an agreement both consumer and provider will have to generate a public-private key pair, used for data proof signing, exchange the public keys and later sign the contract. After this part is done, an agreement is reached.
* The provider will have to publish to data access api the agreement Id, provider private key that was generated and the DataExchangeAgreement to this endpoint:

    <mark>POST /agreement/dataSharingAgreementInfo<mark>

Body example:
```
{
  "agreementId": 1,
  "providerPublicKey": {
    "kty": "EC",
    "crv": "P-256",
    "x": "gdt9dxd1Q9p5fn8Pch8tuMf6h4lZ_NtbgeVAddPkk5M",
    "y": "coJR5-TGBUwIV_5YovlWzt4suV0wnxfvWJDvekJBCwQ",
    "alg": "ES256"
  },
  "providerPrivateKey": {
    "kty": "EC",
    "crv": "P-256",
    "x": "gdt9dxd1Q9p5fn8Pch8tuMf6h4lZ_NtbgeVAddPkk5M",
    "y": "coJR5-TGBUwIV_5YovlWzt4suV0wnxfvWJDvekJBCwQ",
    "d": "KeFLl9SKwpJHuAmyyxe7YXiCr4cDGK4uMU1fxnrrLjw",
    "alg": "ES256"
  },
  "dataSharingAgreement": {
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
      "creationDate": 1672824609,
      "startDate": 1672824609,
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
}
```
* The provider also has to register his batch or stream data connector to Data Access API and that can be done by using this endpoint:

<mark>POST /regds<mark>

Request body:
```
{
  "dataOfferingId": "63b55691f762242150a481d3",
  "description": "reg",
  "url": "http://datasourceurl:9009",
  "action": "register"
}
```
## <mark>For consumer<mark>
* For data trasfer the consumer needs to have the generated keys, the dataExchangeAgreement, an access token, the agreement id and to make the payment to the marketplace. The keys, dataExchangeAgreement and agreement id should be available to the consumer after an agreement between the consumer and the provider is reached. An access token can be retrieved from data access api by login in as a consumer, using the I3M wallet, to this endpoint(you need the access this endpoint by openning a new tab in a browser):

    <mark>GET /oidc/login/consumer<mark>

* The next step is to pay the market fee in order to retrieve a signed transaction. To create a transaction object you can call this endpoint from data access:

    <mark>POST /agreement/payMarketFee/{agreementId}<mark>

agreementId example:
```
17
```

Body example (the Ethereum addresses can be retrieved from the I3M wallet):
```
{
  "senderAddress": "0xb794f5ea0ba39494ce839613fffba74279579268",
  "providerMPAddress": "0x111122220ba39494ce839613fffba74279571234",
  "consumerMPAddress": "0x111122220ba39494ce839613fffba74279571234"
}
```

Response body:
```
"nonce": 3,
    "gasLimit": 12500000,
    "gasPrice": 186063,
    "to": "0x3663f8622526ec82aE571e4265DAd6967dd74260",
    "from": "0x5126Eb9a03c75A732ecCA20EBfca4041142154B5",
    "data": "0xc264679c0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000aad8734423cdd561355b39affdd8afcbe1755f6a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002461393961623536652d653064352d353734662d623637332d37663132333634356361363300000000000000000000000000000000000000000000000000000000"
``` 

* The transaction object needs to be signed using the I3M wallet by using this endpoint:

    <mark>POST /identities/{did}/sign<mark>

Did parameter example:
```
did:ethr:i3m:0x03eddcc54bfbdce4fbd598f4827351feb2310d005fb1d53145e6787d0a6f7b0f5f
```

Body example:
```
{
  "type": "Transaction",
  "data": {
    "nonce": 2,
    "gasLimit": 12500000,
    "gasPrice": 186063,
    "to": "0x3663f8622526ec82aE571e4265DAd6967dd74260",
    "from": "0x5126Eb9a03c75A732ecCA20EBfca4041142154B5"
  }
}
```

Response body:
```
{
  "signature": "0xf863028302d6cf83bebc20943663f8622526ec82ae571e4265dad6967dd7426080801ba0f1e54e9090508f453c415e27e326e543756afaf9a0a59df943e144c899517282a056b0d94183aa059db98f464ecf5b8e0d9d766f9c3f87c265c23fd9a205b07702"
}
```
# 4. Batch data transfer documentation

* After the prerequisite part is in place the consumer can start the batch data transfer by using this endpoint from Data Access API:

    <mark>POST /batch/{data}/{agreementId}<mark>


<mark>The first call will always have to be using this request body:<mark>
```
{
  "blockId": "null",
  "blockAck": "null"
}
```
Data parameter example:
```
exampledata.7z
```
AgreementId parameter example:
```
17
```
Resposne body example:
```
{
  "blockId": "null",
  "nextBlockId": "aa2f58d4d883ef9d91b9324ca9da3ef24a93d2b4727d827d04adfcef03d8109e",
  "poo": "null",
  "cipherBlock": "null"
}
```
<mark>The nextBlockId from response body becomes an input for our blockId in the next request body. Second call request body:<mark>
```
{
  "blockId": "aa2f58d4d883ef9d91b9324ca9da3ef24a93d2b4727d827d04adfcef03d8109e",
  "blockAck": "null"
}
```
Response body:
```
{
  "blockId": "aa2f58d4d883ef9d91b9324ca9da3ef24a93d2b4727d827d04adfcef03d8109e",
  "nextBlockId": "7dac4b8891dcf94d1111d417f0d0571a3b370e94a78645fc847049a33e15c74d",
  "poo": "eyJhbGciOiJFUzI1NiJ9.eyJwcm9vZlR5cGUiOiJQb08iLCJpc3MiOiJvcmlnIiwiZXhjaGFuZ2UiOnsib3JpZyI6IntcImFsZ1wiOlwiRVMyNTZcIixcImNydlwiOlwiUC0yNTZcIixcImt0eVwiOlwiRUNcIixcInhcIjpcIjM0MnRUb1pydmo2NEstMHZQdXE5QjV0OEJ4M2tqT2xWVzU3NFEydm8tellcIixcInlcIjpcIkt0dWtFay01WlN2Snpub1dZbDk5bDZ4OENieGJNRFlKN2ZCYndVOERucGtcIn0iLCJkZXN0Ijoie1wiYWxnXCI6XCJFUzI1NlwiLFwiY3J2XCI6XCJQLTI1NlwiLFwia3R5XCI6XCJFQ1wiLFwieFwiOlwiMzQydFRvWnJ2ajY0Sy0wdlB1cTlCNXQ4Qngza2pPbFZXNTc0UTJ2by16WVwiLFwieVwiOlwiS3R1a0VrLTVaU3ZKem5vV1lsOTlsNng4Q2J4Yk1EWUo3ZkJid1U4RG5wa1wifSIsImVuY0FsZyI6IkEyNTZHQ00iLCJzaWduaW5nQWxnIjoiRVMyNTYiLCJoYXNoQWxnIjoiU0hBLTI1NiIsImxlZGdlckNvbnRyYWN0QWRkcmVzcyI6IjB4OGQ0MDdhMTcyMjYzM2JkZDFkY2YyMjE0NzRiZTdhNDRjMDVkN2MyZiIsImxlZGdlclNpZ25lckFkZHJlc3MiOiIweDE3YmQxMmMyMTM0YWZjMWY2ZTkzMDJhNTMyZWZlMzBjMTliOWU5MDMiLCJwb29Ub1BvckRlbGF5IjoxMDAwMCwicG9vVG9Qb3BEZWxheSI6MjAwMDAsInBvb1RvU2VjcmV0RGVsYXkiOjE1MDAwMCwiY2lwaGVyYmxvY2tEZ3N0IjoiMVU0cUdzQU1sZzRpZllsRV9uRElpQ1l0bHd3ZXlvLWVTbk1aYVp6NjlpQSIsImJsb2NrQ29tbWl0bWVudCI6IlUwSG1zbVJwZWFjT1YyVXdCNkh6RUJhVUlleWIzWjhhVmtqM1d0NEFXdkUiLCJzZWNyZXRDb21taXRtZW50IjoiazlPRDdFS0thLVdIeExHclIza1hfTFlxVzRiUUw4UnFJTUdyTkRIcnNwYyIsImlkIjoiSTlDVEkycnBaakd3eDhzdVRNNWc3XzdYb3VJcXVhRUljQzc4VVJlTFpMMCJ9LCJpYXQiOjE2Njg2OTEwMDR9.lK6GpegAD4noFjXS1WsrCwbIriVZueJQmg0nbnwfYDyVc6-MZLXuU3fR9SWLlQiTO_dOWeUbfA4p1YlC6rspIQ",
  "cipherBlock": "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..mCYHRYnLryZBUyBB.zw0giKL7zROMRAxPuswE2JUrV9Y_GkbR9Kd5EwJv7bskjNOgTiZgnqkpH4ufRlXMmtWNIvzGcSYzCN7RS-NSYSvkGGR5FU1kfZVw2aJToErUDQSRtzVhz-QdJU0ZNHjYWTayhgm4ChMC5MZov1ZWk-R3qYvJXpJyF4xFQ57ysxbf_XNSJcKJ0UvlWkD-wFd7_72C88b9St28tQFtaLujgm-KffAWImkKLI1Km2QX1ZhUmWdblm2NyidBsAGs_E2AL3QqNwvqpvLw2kqHrf0V0D0xxQkUYu1ayvjCyTJnx_UTV7Im3WDruIYrXgOXQW94UwWJWD03pptHdtFR9oQGyQ.BrEeJRdv6edB3b52_zcljQ"
}
```
<mark>From this point on the blockId from response will be as input for blockAck in the next request body and the nextBlockId from response body will be input for the blockId in the request body. Next request body example:<mark>
```
{
  "blockId": "7dac4b8891dcf94d1111d417f0d0571a3b370e94a78645fc847049a33e15c74d",
  "blockAck": "aa2f58d4d883ef9d91b9324ca9da3ef24a93d2b4727d827d04adfcef03d8109e"
}
```
<mark>This will go on until nextBlockId from response body will be "null". In that case there are no more blocks to be transfered and the data transfer will finish.<mark>

When the first call reaches Data Access API for a specific file to be transfered, a JSON file will be generated which will map the file into blocks depending on block size. To each block there will be attributed an Id. Based on those Ids the batch transfer endpoint can be called iteratively and the file can be recreated on the consumer side.

JSON map of a file example:
```
{
    "records": [
        {
            "aa2f58d4d883ef9d91b9324ca9da3ef24a93d2b4727d827d04adfcef03d8109e": "0"
        },
        {
            "7dac4b8891dcf94d1111d417f0d0571a3b370e94a78645fc847049a33e15c74d": "256"
        },
        {
            "611c20174174895f68e0499655a12957cf93e51b8af8d8d71c4df78ba4cf9da5": "512"
        }
    ]
}
```
## <mark>Client side batch data transfer code example for transferring one block/one file:<mark>
```
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
```
# 5. Stream data transfer documentation
In order to start streaming data from a data source to the consumer, the data source connector has to be registered to Data Access by the provider. This can be done to this endpoint:

<mark>POST /regds<mark>

Request body:
```
{
  "dataOfferingId": "123abc",
  "description": "reg",
  "url": "http://datasourceurl:9009",
  "action": "register"
}
```
The client can connect to with an mqtt client to the broker:
```
mqtt://data-access-url-example:1884
```
To receive data, the consumer can subscribe to this mqtt topic:
```
/to/consumerId/dataSourceUid/agreementId
```
Topic params example:
```
consumerId = "did:ethr:i3m:0x03eddcc54bfbdce4fbd598f4827351feb2310d005fb1d53145e6787d0a6f7b0f5f"
dataSourceUid = "123abc"
agreementId = "1"
```
After the consumer subscribes, the connector will receive request that says that it can start sending streaming data to Data Access API, by using this endpoint:

<mark>POST /newdata/{uid}<mark>

Data Access will then forward the data received from the connector to the consumer.

## <mark>Client side stream data transfer code example:<mark>
```
import { StreamResponse } from '../types/openapi';
import * as nonRepudiationLibrary from '@i3m/non-repudiation-library';
import * as mqtt from 'mqtt';
import * as fs from 'fs';
import jwtDecode, { JwtPayload } from "jwt-decode";
import { HttpInitiatorTransport, Session } from '@i3m/wallet-protocol';
import { WalletApi } from '@i3m/wallet-protocol-api';

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

const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIwLjAuMC4wIiwiYXVkIjoiMC4wLjAuMCIsImV4cCI6MTY3MDYwNTg3OCwic3ViIjoiZGlkOmV0aHI6aTNtOjB4MDNlZGRjYzU0YmZiZGNlNGZiZDU5OGY0ODI3MzUxZmViMjMxMGQwMDVmYjFkNTMxNDVlNjc4N2QwYTZmN2IwZjVmIiwic2NvcGUiOiJvcGVuaWQgdmMgdmNlOmNvbnN1bWVyIiwiaWF0IjoxNjcwNTE5NDc4fQ.aBHwBt0MPIq1rArz2D-UIS0UC3GJMXEbzE6FXVmrgLo'
const offeringId = '6331c51ff69d7c2212c9ec4a'
const agreementId = 17

async function streamSubscribe() {
    try {

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
```