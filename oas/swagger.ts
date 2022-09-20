const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' })
const outputFile = './open-api.json'
const endpointsFiles = ['../routes/*.ts']

const doc = {
    openapi: 3.0,
    info: {
        version: '3.0.0',
        title: 'Secure Data Access API',
        description: 'Secure Data Access API for the i3-Market Project',
        license: {
            name: 'Apache 2.0',
            url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
        }
    },
    basePath: '/',
    schemes: ['http', 'https'],
    tags: [
        {
            'name': 'AgreementController',
            'description': 'Endpoints for agreement and market fee'
        },
        {
            'name': 'BatchController',
            'description': 'Endpoints for batch data transfer'
        },
        {
            'name': 'StreamController',
            'description': 'Endpoints for stream data transfer.'
        },
        {
            'name': 'StreamAuthController',
            'description': 'Endpoints used by mqtt broker to authenticate the consumer'
        },
        {
            'name': 'DataTransferReportController',
            'description': 'Endpoints related to transfer report'
        },
        {
            'name': 'OidcAuthController',
            'description': 'Endpoints to request a bearer token as consumer or provider'
        }
    ],
    components: {
        schemas: {
            agreementId: {
                AgreementId: 1
            },
            dataExchangeAgreementReq: {
                consumerPublicKey: {kty:'EC',crv:'P-256',x:'342tToZrvj64K-0vPuq9B5t8Bx3kjOlVW574Q2vo-zY',y:'KtukEk-5ZSvJznoWYl99l6x8CbxbMDYJ7fBbwU8Dnpk',alg:'ES256'},
                providerPublicKey: {kty:'EC',crv:'P-256',x:'342tToZrvj64K-0vPuq9B5t8Bx3kjOlVW574Q2vo-zY',y:'KtukEk-5ZSvJznoWYl99l6x8CbxbMDYJ7fBbwU8Dnpk',alg:'ES256'}
            },
            dataExchangeAgreement: {
                DataExchangeAgreement: '{\'orig\':\'{\'kty\':\'EC\',\'crv\':\'P-256\',\'x\':\'342tToZrvj64K-0vPuq9B5t8Bx3kjOlVW574Q2vo-zY\\\',\\\'y\\\':\\\'KtukEk-5ZSvJznoWYl99l6x8CbxbMDYJ7fBbwU8Dnpk\\\',\\\'alg\\\':\\\'ES256\\\'}\',\'encAlg\':\'A256GCM\',\'signingAlg\':\'ES256\',\'hashAlg\':\'SHA-256\',\'ledgerContractAddress\':\'0x8d407a1722633bdd1dcf221474be7a44c05d7c2f\',\'ledgerSignerAddress\':\'0x17bd12C2134AfC1f6E9302a532eFE30C19B9E903\',\'pooToPorDelay\':10000,\'pooToPopDelay\':20000,\'pooToSecretDelay\':150000,\'dest\':\'{\\\'kty\\\':\\\'EC\\\',\\\'crv\\\':\\\'P-256\\\',\\\'x\\\':\\\'342tToZrvj64K-0vPuq9B5t8Bx3kjOlVW574Q2vo-zY\\\',\\\'y\\\':\\\'KtukEk-5ZSvJznoWYl99l6x8CbxbMDYJ7fBbwU8Dnpk\\\',\\\'alg\\\':\\\'ES256\\\'}\'}'
            },
            providerPublicKeyReq: {
                orig: {'kty':'EC','crv':'P-256','x':'342tToZrvj64K-0vPuq9B5t8Bx3kjOlVW574Q2vo-zY','y':'KtukEk-5ZSvJznoWYl99l6x8CbxbMDYJ7fBbwU8Dnpk','alg':'ES256'},
                encAlg: 'A256GCM',
                signingAlg: 'ES256',
                hashAlg: 'SHA-256',
                ledgerContractAddress: '0x8d407a1722633bdd1dcf221474be7a44c05d7c2f',
                ledgerSignerAddress: '0x17bd12C2134AfC1f6E9302a532eFE30C19B9E903',
                pooToPorDelay: 10000,
                pooToPopDelay: 20000,
                pooToSecretDelay: 150000
            },
            publicKey: {
                kty:'EC',
                crv:'P-256',
                x:'342tToZrvj64K-0vPuq9B5t8Bx3kjOlVW574Q2vo-zY',
                y:'KtukEk-5ZSvJznoWYl99l6x8CbxbMDYJ7fBbwU8Dnpk',
                alg:'ES256'
            },
            payMarketFeeReq: {
                senderAddress: '0x5126Eb9a03c75A732ecCA20EBfca4041142154B5',
                providerAddress: '0xaad8734423CDd561355B39aFFDD8AFcbE1755f6a'
            },
            transactionObject: {
                transferId: '6fa4973b-11ce-56d8-8544-660e1a334b92',
                transactionObject: {
                  chainId: 1,
                  nonce: 1,
                  gasLimit: 6721975,
                  gasPrice: 201966,
                  to: '0x5780262041318FD9fc8E345F665bEc7684E15C75',
                  from: '0xb3a0ED21c54196E4B446D79b7925766aa86BC196',
                  data: '0x909770870000000000000000000000000000000000000000000000000000000000000060000000000000000000000000f3d15f97bf1b55b486486de2d819649bc92fff6b000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000002438646265373434372d333637362d353262632d623439312d30393638653735626134663400000000000000000000000000000000000000000000000000000000'
                }
            },
            batchReq: {
                blockId: 'null',
                blockAck: 'null'
            },
            batchFirstBlockRes: {
                blockId: "null", 
                nextBlockId: "7dac4b8891dcf94d1111d417f0d0571a3b370e94a78645fc847049a33e15c74d", 
                poo: "null", 
                cipherBlock: "null",
            },
            batchRes: {
                blockId: "aa2f58d4d883ef9d91b9324ca9da3ef24a93d2b4727d827d04adfcef03d8109e",
                nextBlockId: "7dac4b8891dcf94d1111d417f0d0571a3b370e94a78645fc847049a33e15c74d",
                poo: "eyJhbGciOiJFUzI1NiJ9.eyJwcm9vZlR5cGUiOiJQb08iLCJpc3MiOiJvcmlnIiwiZXhjaGFuZ2UiOnsib3JpZyI6IntcImFsZ1wiOlwiRVMyNTZcIixcImNydlwiOlwiUC0yNTZcIixcImt0eVwiOlwiRUNcIixcInhcIjpcIjM0MnRUb1pydmo2NEstMHZQdXE5QjV0OEJ4M2tqT2xWVzU3NFEydm8tellcIixcInlcIjpcIkt0dWtFay01WlN2Snpub1dZbDk5bDZ4OENieGJNRFlKN2ZCYndVOERucGtcIn0iLCJlbmNBbGciOiJBMjU2R0NNIiwic2lnbmluZ0FsZyI6IkVTMjU2IiwiaGFzaEFsZyI6IlNIQS0yNTYiLCJsZWRnZXJDb250cmFjdEFkZHJlc3MiOiIweDhkNDA3YTE3MjI2MzNiZGQxZGNmMjIxNDc0YmU3YTQ0YzA1ZDdjMmYiLCJsZWRnZXJTaWduZXJBZGRyZXNzIjoiMHgxN2JkMTJjMjEzNGFmYzFmNmU5MzAyYTUzMmVmZTMwYzE5YjllOTAzIiwicG9vVG9Qb3JEZWxheSI6MTAwMDAsInBvb1RvUG9wRGVsYXkiOjIwMDAwLCJwb29Ub1NlY3JldERlbGF5IjoxNTAwMDAsImRlc3QiOiJ7XCJhbGdcIjpcIkVTMjU2XCIsXCJjcnZcIjpcIlAtMjU2XCIsXCJrdHlcIjpcIkVDXCIsXCJ4XCI6XCIzNDJ0VG9acnZqNjRLLTB2UHVxOUI1dDhCeDNrak9sVlc1NzRRMnZvLXpZXCIsXCJ5XCI6XCJLdHVrRWstNVpTdkp6bm9XWWw5OWw2eDhDYnhiTURZSjdmQmJ3VThEbnBrXCJ9IiwiY2lwaGVyYmxvY2tEZ3N0IjoiSjlZS0hDeHZ0bU5odklUYlVnaTFJRmdwdkZkVXhJMW9CYTNvT2stUkpBWSIsImJsb2NrQ29tbWl0bWVudCI6InRoeUh4WHR5X1BpQURfV1pEbEZyUnNJXzBhZ2FYdFgtNGZjMFVFUnhLakUiLCJzZWNyZXRDb21taXRtZW50IjoiYzNVMmllUG1rd1RBRXVVNzVmRHNFS2I4TWNEeFVBWFpvTzR6ME1YTnZTVSIsImlkIjoia1M2WXdSZ1ZaYzVrVnF0WEtLWWJSRHJaSnh5cG1FZWdIV1lYamZQVFE3SSJ9LCJpYXQiOjE2NjM2OTgzNjF9.gaJQrpUBzlE1UhA9a_zPLnXYcsLSz722MwsdQ0GjRIwzxoV0L13oWgc_wKzi0ffjYym02qlYUOHoT4o4z_32sA",
                cipherBlock: "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..4hORyefJAgonAo86.dsArbqg4ADQHmT1fUOZr_tx6nafVTOH3gbDiTLltiSNESkNlPbOYpt_wVX-jlj86qs7IddImFmYvUrABjuTOB2obt6W7NV3w0ZvIaMhp0gQewFY5sCRi9skTSNe0tuxCRsEvSX4on4Awyas26KsiTXRbOiwn99P5OrCp86m5c59xqH8lbazyuazBm65UJM2JSLWU33a9a8B-cgkk0PaJc0ouwJ1l0Y5ffMMnPlgYHfuNJLsQOE-jkgQFrCnODEW_HxKWf_KFkFhk8ti9W6hmXFLSVs4zk752qij5zemq_tgdHMmR9Exusob9aA1xKGalCLSy6XpI8Ho2psAw73VJKA.6lTdMEI-og4gYaj8YmfJuw"
            },
            batchLastBlockRes: {
                blockId: "null", 
                nextBlockId: "null", 
                poo: "null", 
                cipherBlock: "null", 
                transactionObject: {
                    transactionObject: {
                      blockHash: "0xe3e80f60a730e5d24d7299c917edeb3fd4d224fcfa802184d498c73c03d18320",
                      blockNumber: 51532,
                      contractAddress: null,
                      cumulativeGasUsed: 186954,
                      from: "0xa067e6b09b77f027b1c8e024469d820ca75dd2bf",
                      gasUsed: 186954,
                      logs: [
                        {
                          address: "0x83a99f8170a0ba72fbCb2bD4eB739de964603854",
                          topics: [
                            "0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62",
                            "0x000000000000000000000000a067e6b09b77f027b1c8e024469d820ca75dd2bf",
                            "0x0000000000000000000000000000000000000000000000000000000000000000",
                            "0x000000000000000000000000ff8eab3673c32559b63ff391772aa300121a94d4"
                          ],
                          data: "0x0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a",
                          blockNumber: 51532,
                          transactionHash: "0x89a7ec9974fcdd99bd1427c410da48fb9e51f74c57837b38be3b43e9f3d8a32f",
                          transactionIndex: 0,
                          blockHash: "0xe3e80f60a730e5d24d7299c917edeb3fd4d224fcfa802184d498c73c03d18320",
                          logIndex: 0,
                          removed: false,
                          id: "log_008b8257"
                        },
                        {
                          address: "0x83a99f8170a0ba72fbCb2bD4eB739de964603854",
                          topics: [
                            "0xdc51063e5ef77d99943e8395b0bb76177d3959e8bf37a0e41937bdd9e99fc8ff"
                          ],
                          data: "0x000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000ff8eab3673c32559b63ff391772aa300121a94d4000000000000000000000000000000000000000000000000000000000000002433646461623465312d373866612d353935342d616639372d35373232343634643131633700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b65786368616e67655f696e000000000000000000000000000000000000000000",
                          blockNumber: 51532,
                          transactionHash: "0x89a7ec9974fcdd99bd1427c410da48fb9e51f74c57837b38be3b43e9f3d8a32f",
                          transactionIndex: 0,
                          blockHash: "0xe3e80f60a730e5d24d7299c917edeb3fd4d224fcfa802184d498c73c03d18320",
                          logIndex: 1,
                          removed: false,
                          id: "log_4b6bbe14"
                        }
                      ],
                      logsBloom: "0x00000000000000000800000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000040000000000000000010000000000000000000000000000000000000000000020000000000000400000800000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000008000002000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000008000000000000000020000000000000000040000040000000000000000010000000000000080000000000",
                      status: true,
                      to: "0x83a99f8170a0ba72fbcb2bd4eb739de964603854",
                      transactionHash: "0x89a7ec9974fcdd99bd1427c410da48fb9e51f74c57837b38be3b43e9f3d8a32f",
                      transactionIndex: 0
                    }
                  }
            },
            popReq: {
                por: "eyJhbGciOiJFUzI1NiJ9.eyJwcm9vZlR5cGUiOiJQb1IiLCJpc3MiOiJkZXN0IiwiZXhjaGFuZ2UiOnsib3JpZyI6IntcImFsZ1wiOlwiRVMyNTZcIixcImNydlwiOlwiUC0yNTZcIixcImt0eVwiOlwiRUNcIixcInhcIjpcIjM0MnRUb1pydmo2NEstMHZQdXE5QjV0OEJ4M2tqT2xWVzU3NFEydm8tellcIixcInlcIjpcIkt0dWtFay01WlN2Snpub1dZbDk5bDZ4OENieGJNRFlKN2ZCYndVOERucGtcIn0iLCJlbmNBbGciOiJBMjU2R0NNIiwic2lnbmluZ0FsZyI6IkVTMjU2IiwiaGFzaEFsZyI6IlNIQS0yNTYiLCJsZWRnZXJDb250cmFjdEFkZHJlc3MiOiIweDhkNDA3YTE3MjI2MzNiZGQxZGNmMjIxNDc0YmU3YTQ0YzA1ZDdjMmYiLCJsZWRnZXJTaWduZXJBZGRyZXNzIjoiMHgxN2JkMTJjMjEzNGFmYzFmNmU5MzAyYTUzMmVmZTMwYzE5YjllOTAzIiwicG9vVG9Qb3JEZWxheSI6MTAwMDAsInBvb1RvUG9wRGVsYXkiOjIwMDAwLCJwb29Ub1NlY3JldERlbGF5IjoxNTAwMDAsImRlc3QiOiJ7XCJhbGdcIjpcIkVTMjU2XCIsXCJjcnZcIjpcIlAtMjU2XCIsXCJrdHlcIjpcIkVDXCIsXCJ4XCI6XCIzNDJ0VG9acnZqNjRLLTB2UHVxOUI1dDhCeDNrak9sVlc1NzRRMnZvLXpZXCIsXCJ5XCI6XCJLdHVrRWstNVpTdkp6bm9XWWw5OWw2eDhDYnhiTURZSjdmQmJ3VThEbnBrXCJ9IiwiY2lwaGVyYmxvY2tEZ3N0IjoiYXhaYVpNM25JT2tmTG9zZ3FBR2lnTTNyNkdLTXJSNWZ3UGlRNFJQQW5zUSIsImJsb2NrQ29tbWl0bWVudCI6InRoeUh4WHR5X1BpQURfV1pEbEZyUnNJXzBhZ2FYdFgtNGZjMFVFUnhLakUiLCJzZWNyZXRDb21taXRtZW50IjoiMU1RU2xGUzlvRzhtOVJOcG5HTlNLNHJQU2Y1NTBZWFNiTkZOck12YTl2RSIsImlkIjoiMmVPRDlwWFkwMWR5YmY1aVl5LURvanlmQjdValg1RWR1V3hKbWxQdkFVYyJ9LCJwb28iOiJleUpoYkdjaU9pSkZVekkxTmlKOS5leUp3Y205dlpsUjVjR1VpT2lKUWIwOGlMQ0pwYzNNaU9pSnZjbWxuSWl3aVpYaGphR0Z1WjJVaU9uc2liM0pwWnlJNkludGNJbUZzWjF3aU9sd2lSVk15TlRaY0lpeGNJbU55ZGx3aU9sd2lVQzB5TlRaY0lpeGNJbXQwZVZ3aU9sd2lSVU5jSWl4Y0luaGNJanBjSWpNME1uUlViMXB5ZG1vMk5Fc3RNSFpRZFhFNVFqVjBPRUo0TTJ0cVQyeFdWelUzTkZFeWRtOHRlbGxjSWl4Y0lubGNJanBjSWt0MGRXdEZheTAxV2xOMlNucHViMWRaYkRrNWJEWjRPRU5pZUdKTlJGbEtOMlpDWW5kVk9FUnVjR3RjSW4waUxDSmxibU5CYkdjaU9pSkJNalUyUjBOTklpd2ljMmxuYm1sdVowRnNaeUk2SWtWVE1qVTJJaXdpYUdGemFFRnNaeUk2SWxOSVFTMHlOVFlpTENKc1pXUm5aWEpEYjI1MGNtRmpkRUZrWkhKbGMzTWlPaUl3ZURoa05EQTNZVEUzTWpJMk16TmlaR1F4WkdObU1qSXhORGMwWW1VM1lUUTBZekExWkRkak1tWWlMQ0pzWldSblpYSlRhV2R1WlhKQlpHUnlaWE56SWpvaU1IZ3hOMkprTVRKak1qRXpOR0ZtWXpGbU5tVTVNekF5WVRVek1tVm1aVE13WXpFNVlqbGxPVEF6SWl3aWNHOXZWRzlRYjNKRVpXeGhlU0k2TVRBd01EQXNJbkJ2YjFSdlVHOXdSR1ZzWVhraU9qSXdNREF3TENKd2IyOVViMU5sWTNKbGRFUmxiR0Y1SWpveE5UQXdNREFzSW1SbGMzUWlPaUo3WENKaGJHZGNJanBjSWtWVE1qVTJYQ0lzWENKamNuWmNJanBjSWxBdE1qVTJYQ0lzWENKcmRIbGNJanBjSWtWRFhDSXNYQ0o0WENJNlhDSXpOREowVkc5YWNuWnFOalJMTFRCMlVIVnhPVUkxZERoQ2VETnJhazlzVmxjMU56UlJNblp2TFhwWlhDSXNYQ0o1WENJNlhDSkxkSFZyUldzdE5WcFRka3A2Ym05WFdXdzVPV3cyZURoRFluaGlUVVJaU2pkbVFtSjNWVGhFYm5CclhDSjlJaXdpWTJsd2FHVnlZbXh2WTJ0RVozTjBJam9pWVhoYVlWcE5NMjVKVDJ0bVRHOXpaM0ZCUjJsblRUTnlOa2RMVFhKU05XWjNVR2xSTkZKUVFXNXpVU0lzSW1Kc2IyTnJRMjl0YldsMGJXVnVkQ0k2SW5Sb2VVaDRXSFI1WDFCcFFVUmZWMXBFYkVaeVVuTkpYekJoWjJGWWRGZ3ROR1pqTUZWRlVuaExha1VpTENKelpXTnlaWFJEYjIxdGFYUnRaVzUwSWpvaU1VMVJVMnhHVXpsdlJ6aHRPVkpPY0c1SFRsTkxOSEpRVTJZMU5UQlpXRk5pVGtaT2NrMTJZVGwyUlNJc0ltbGtJam9pTW1WUFJEbHdXRmt3TVdSNVltWTFhVmw1TFVSdmFubG1RamRWYWxnMVJXUjFWM2hLYld4UWRrRlZZeUo5TENKcFlYUWlPakUyTmpNMk56SXlPRE45LmZiRjI0T0lKUXpNajEwaXZzWDRIdHp0VURCVkhmZEtZQkJ2ZmNpSDNlZFJuWTB4aExPelczZmJmOS1ZRnI5R0lOM0FlWllEOE0za0xKbFZrb0JKSndnIiwiaWF0IjoxNjYzNjcyMjgzfQ.xn8oNMJT161g9TjRIZDy9vundr4ON1k8NWLdAcnPpNTj8aqRJVIvs8mi3uLDUZ5YIWKqzmqVzyK24O7L9CQnvw"
            },
            popRes: {
                pop: "eyJhbGciOiJFUzI1NiJ9.eyJwcm9vZlR5cGUiOiJQb1AiLCJpc3MiOiJvcmlnIiwiZXhjaGFuZ2UiOnsib3JpZyI6IntcImFsZ1wiOlwiRVMyNTZcIixcImNydlwiOlwiUC0yNTZcIixcImt0eVwiOlwiRUNcIixcInhcIjpcIjM0MnRUb1pydmo2NEstMHZQdXE5QjV0OEJ4M2tqT2xWVzU3NFEydm8tellcIixcInlcIjpcIkt0dWtFay01WlN2Snpub1dZbDk5bDZ4OENieGJNRFlKN2ZCYndVOERucGtcIn0iLCJlbmNBbGciOiJBMjU2R0NNIiwic2lnbmluZ0FsZyI6IkVTMjU2IiwiaGFzaEFsZyI6IlNIQS0yNTYiLCJsZWRnZXJDb250cmFjdEFkZHJlc3MiOiIweDhkNDA3YTE3MjI2MzNiZGQxZGNmMjIxNDc0YmU3YTQ0YzA1ZDdjMmYiLCJsZWRnZXJTaWduZXJBZGRyZXNzIjoiMHgxN2JkMTJjMjEzNGFmYzFmNmU5MzAyYTUzMmVmZTMwYzE5YjllOTAzIiwicG9vVG9Qb3JEZWxheSI6MTAwMDAsInBvb1RvUG9wRGVsYXkiOjIwMDAwLCJwb29Ub1NlY3JldERlbGF5IjoxNTAwMDAsImRlc3QiOiJ7XCJhbGdcIjpcIkVTMjU2XCIsXCJjcnZcIjpcIlAtMjU2XCIsXCJrdHlcIjpcIkVDXCIsXCJ4XCI6XCIzNDJ0VG9acnZqNjRLLTB2UHVxOUI1dDhCeDNrak9sVlc1NzRRMnZvLXpZXCIsXCJ5XCI6XCJLdHVrRWstNVpTdkp6bm9XWWw5OWw2eDhDYnhiTURZSjdmQmJ3VThEbnBrXCJ9IiwiY2lwaGVyYmxvY2tEZ3N0IjoiYXhaYVpNM25JT2tmTG9zZ3FBR2lnTTNyNkdLTXJSNWZ3UGlRNFJQQW5zUSIsImJsb2NrQ29tbWl0bWVudCI6InRoeUh4WHR5X1BpQURfV1pEbEZyUnNJXzBhZ2FYdFgtNGZjMFVFUnhLakUiLCJzZWNyZXRDb21taXRtZW50IjoiMU1RU2xGUzlvRzhtOVJOcG5HTlNLNHJQU2Y1NTBZWFNiTkZOck12YTl2RSIsImlkIjoiMmVPRDlwWFkwMWR5YmY1aVl5LURvanlmQjdValg1RWR1V3hKbWxQdkFVYyJ9LCJwb3IiOiJleUpoYkdjaU9pSkZVekkxTmlKOS5leUp3Y205dlpsUjVjR1VpT2lKUWIxSWlMQ0pwYzNNaU9pSmtaWE4wSWl3aVpYaGphR0Z1WjJVaU9uc2liM0pwWnlJNkludGNJbUZzWjF3aU9sd2lSVk15TlRaY0lpeGNJbU55ZGx3aU9sd2lVQzB5TlRaY0lpeGNJbXQwZVZ3aU9sd2lSVU5jSWl4Y0luaGNJanBjSWpNME1uUlViMXB5ZG1vMk5Fc3RNSFpRZFhFNVFqVjBPRUo0TTJ0cVQyeFdWelUzTkZFeWRtOHRlbGxjSWl4Y0lubGNJanBjSWt0MGRXdEZheTAxV2xOMlNucHViMWRaYkRrNWJEWjRPRU5pZUdKTlJGbEtOMlpDWW5kVk9FUnVjR3RjSW4waUxDSmxibU5CYkdjaU9pSkJNalUyUjBOTklpd2ljMmxuYm1sdVowRnNaeUk2SWtWVE1qVTJJaXdpYUdGemFFRnNaeUk2SWxOSVFTMHlOVFlpTENKc1pXUm5aWEpEYjI1MGNtRmpkRUZrWkhKbGMzTWlPaUl3ZURoa05EQTNZVEUzTWpJMk16TmlaR1F4WkdObU1qSXhORGMwWW1VM1lUUTBZekExWkRkak1tWWlMQ0pzWldSblpYSlRhV2R1WlhKQlpHUnlaWE56SWpvaU1IZ3hOMkprTVRKak1qRXpOR0ZtWXpGbU5tVTVNekF5WVRVek1tVm1aVE13WXpFNVlqbGxPVEF6SWl3aWNHOXZWRzlRYjNKRVpXeGhlU0k2TVRBd01EQXNJbkJ2YjFSdlVHOXdSR1ZzWVhraU9qSXdNREF3TENKd2IyOVViMU5sWTNKbGRFUmxiR0Y1SWpveE5UQXdNREFzSW1SbGMzUWlPaUo3WENKaGJHZGNJanBjSWtWVE1qVTJYQ0lzWENKamNuWmNJanBjSWxBdE1qVTJYQ0lzWENKcmRIbGNJanBjSWtWRFhDSXNYQ0o0WENJNlhDSXpOREowVkc5YWNuWnFOalJMTFRCMlVIVnhPVUkxZERoQ2VETnJhazlzVmxjMU56UlJNblp2TFhwWlhDSXNYQ0o1WENJNlhDSkxkSFZyUldzdE5WcFRka3A2Ym05WFdXdzVPV3cyZURoRFluaGlUVVJaU2pkbVFtSjNWVGhFYm5CclhDSjlJaXdpWTJsd2FHVnlZbXh2WTJ0RVozTjBJam9pWVhoYVlWcE5NMjVKVDJ0bVRHOXpaM0ZCUjJsblRUTnlOa2RMVFhKU05XWjNVR2xSTkZKUVFXNXpVU0lzSW1Kc2IyTnJRMjl0YldsMGJXVnVkQ0k2SW5Sb2VVaDRXSFI1WDFCcFFVUmZWMXBFYkVaeVVuTkpYekJoWjJGWWRGZ3ROR1pqTUZWRlVuaExha1VpTENKelpXTnlaWFJEYjIxdGFYUnRaVzUwSWpvaU1VMVJVMnhHVXpsdlJ6aHRPVkpPY0c1SFRsTkxOSEpRVTJZMU5UQlpXRk5pVGtaT2NrMTJZVGwyUlNJc0ltbGtJam9pTW1WUFJEbHdXRmt3TVdSNVltWTFhVmw1TFVSdmFubG1RamRWYWxnMVJXUjFWM2hLYld4UWRrRlZZeUo5TENKd2IyOGlPaUpsZVVwb1lrZGphVTlwU2taVmVra3hUbWxLT1M1bGVVcDNZMjA1ZGxwc1VqVmpSMVZwVDJsS1VXSXdPR2xNUTBwd1l6Tk5hVTlwU25aamJXeHVTV2wzYVZwWWFHcGhSMFoxV2pKVmFVOXVjMmxpTTBwd1dubEpOa2x1ZEdOSmJVWnpXakYzYVU5c2QybFNWazE1VGxSYVkwbHBlR05KYlU1NVpHeDNhVTlzZDJsVlF6QjVUbFJhWTBscGVHTkpiWFF3WlZaM2FVOXNkMmxTVlU1alNXbDRZMGx1YUdOSmFuQmpTV3BOTUUxdVVsVmlNWEI1Wkcxdk1rNUZjM1JOU0ZwUlpGaEZOVkZxVmpCUFJVbzBUVEowY1ZReWVGZFdlbFV6VGtaRmVXUnRPSFJsYkd4alNXbDRZMGx1YkdOSmFuQmpTV3QwTUdSWGRFWmhlVEF4VjJ4T01sTnVjSFZpTVdSYVlrUnJOV0pFV2pSUFJVNXBaVWRLVGxKR2JFdE9NbHBEV1c1a1ZrOUZVblZqUjNSalNXNHdhVXhEU214aWJVNUNZa2RqYVU5cFNrSk5hbFV5VWpCT1RrbHBkMmxqTW14dVltMXNkVm93Um5OYWVVazJTV3RXVkUxcVZUSkphWGRwWVVkR2VtRkZSbk5hZVVrMlNXeE9TVkZUTUhsT1ZGbHBURU5LYzFwWFVtNWFXRXBFWWpJMU1HTnRSbXBrUlVacldraEtiR016VFdsUGFVbDNaVVJvYTA1RVFUTlpWRVV6VFdwSk1rMTZUbWxhUjFGNFdrZE9iVTFxU1hoT1JHTXdXVzFWTTFsVVVUQlpla0V4V2tSa2FrMXRXV2xNUTBweldsZFNibHBZU2xSaFYyUjFXbGhLUWxwSFVubGFXRTU2U1dwdmFVMUlaM2hPTWtwclRWUkthazFxUlhwT1IwWnRXWHBHYlU1dFZUVk5la0Y1V1ZSVmVrMXRWbTFhVkUxM1dYcEZOVmxxYkd4UFZFRjZTV2wzYVdOSE9YWldSemxSWWpOS1JWcFhlR2hsVTBrMlRWUkJkMDFFUVhOSmJrSjJZakZTZGxWSE9YZFNSMVp6V1ZocmFVOXFTWGROUkVGM1RFTktkMkl5T1ZWaU1VNXNXVE5LYkdSRlVteGlSMFkxU1dwdmVFNVVRWGROUkVGelNXMVNiR016VVdsUGFVbzNXRU5LYUdKSFpHTkphbkJqU1d0V1ZFMXFWVEpZUTBseldFTkthbU51V21OSmFuQmpTV3hCZEUxcVZUSllRMGx6V0VOS2NtUkliR05KYW5CalNXdFdSRmhEU1hOWVEwbzBXRU5KTmxoRFNYcE9SRW93VmtjNVlXTnVXbkZPYWxKTVRGUkNNbFZJVm5oUFZVa3haRVJvUTJWRVRuSmhhemx6Vm14ak1VNTZVbEpOYmxwMlRGaHdXbGhEU1hOWVEwbzFXRU5KTmxoRFNreGtTRlp5VWxkemRFNVdjRlJrYTNBMlltMDVXRmRYZHpWUFYzY3laVVJvUkZsdWFHbFVWVkphVTJwa2JWRnRTak5XVkdoRlltNUNjbGhEU2psSmFYZHBXVEpzZDJGSFZubFpiWGgyV1RKMFJWb3pUakJKYW05cFdWaG9ZVmxXY0U1Tk1qVktWREowYlZSSE9YcGFNMFpDVWpKc2JsUlVUbmxPYTJSTVZGaEtVMDVYV2pOVlIyeFNUa1pLVVZGWE5YcFZVMGx6U1cxS2MySXlUbkpSTWpsMFlsZHNNR0pYVm5Wa1EwazJTVzVTYjJWVmFEUlhTRkkxV0RGQ2NGRlZVbVpXTVhCRllrVmFlVlZ1VGtwWWVrSm9XakpHV1dSR1ozUk9SMXBxVFVaV1JsVnVhRXhoYTFWcFRFTktlbHBYVG5sYVdGSkVZakl4ZEdGWVVuUmFWelV3U1dwdmFVMVZNVkpWTW5oSFZYcHNkbEo2YUhSUFZrcFBZMGMxU0ZSc1RreE9TRXBSVlRKWk1VNVVRbHBYUms1cFZHdGFUMk5yTVRKWlZHd3lVbE5KYzBsdGJHdEphbTlwVFcxV1VGSkViSGRYUm10M1RWZFNOVmx0V1RGaFZtdzFURlZTZG1GdWJHMVJhbVJXWVd4bk1WSlhVakZXTTJoTFlsZDRVV1JyUmxaWmVVbzVURU5LY0ZsWVVXbFBha1V5VG1wTk1rNTZTWGxQUkU0NUxtWmlSakkwVDBsS1VYcE5hakV3YVhaeldEUklkSHAwVlVSQ1ZraG1aRXRaUWtKMlptTnBTRE5sWkZKdVdUQjRhRXhQZWxjelptSm1PUzFaUm5JNVIwbE9NMEZsV2xsRU9FMHphMHhLYkZacmIwSktTbmRuSWl3aWFXRjBJam94TmpZek5qY3lNamd6ZlEueG44b05NSlQxNjFnOVRqUklaRHk5dnVuZHI0T04xazhOV0xkQWNuUHBOVGo4YXFSSlZJdnM4bWkzdUxEVVo1WUlXS3F6bXFWenlLMjRPN0w5Q1FudnciLCJzZWNyZXQiOiJ7XCJrdHlcIjpcIm9jdFwiLFwia1wiOlwiakcxMll3N0xsOUtlaXpodG04UGcwMmxRTUV5UDhqaVF5cXlFc0YzakhZWVwiLFwiYWxnXCI6XCJBMjU2R0NNXCJ9IiwidmVyaWZpY2F0aW9uQ29kZSI6IjB4NjYzYmI4YTUyYTg3YjYwNDJjNTYzOGJjN2FiMTRjZDgxNWI3NDRjOGE2MzU4MGFiNzliOWRjZGMzOTQxN2UzZSIsImlhdCI6MTY2MzY3MjI4NH0.P_1sEiVi5buE_EJ5LGqIvh5UnukzcFHIfqwd97-dwUMRPtk7iYKRWswVFbpSx1gmHgy50BUkGIiDvjcWNttqdw"
            }
        },
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },
    },
    security: [
        {
            'bearerAuth': []
        }
    ],
    servers: [
        {
            url: '/'
        },
        {
            url: 'http://95.211.3.244:3100'
        },
        {
            url: 'http://95.211.3.249:3100'
        },
        {
            url: 'http://95.211.3.250:3100'
        },
        {
            url: 'http://95.211.3.251:3100',
            variables: {}
        }
    ]
}

swaggerAutogen(outputFile, endpointsFiles, doc)