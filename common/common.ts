import { env } from "../config/env";
import { AgreementState, ConnectorResponse, JsonMapOfData, PaymentBody, ResponseData, SerializedTxObj, TransactionObject } from "../types/openapi";
import { JwtClaims } from '../types/openapi';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import 'isomorphic-fetch';
import { Agreement } from "../types/agreement";

export async function retrieveRawPaymentTransaction(payment: PaymentBody) {

    const request = await fetch(`${env.tokenizerUrl}/api/v1/operations/fee-payment`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payment)
    });

    const rawTransaction = await request.json();
    console.log(rawTransaction)

    return rawTransaction
}

export async function deployRawPaymentTx(serializedTxObj: SerializedTxObj) {

    const request = await fetch(`${env.tokenizerUrl}/api/v1/treasury/transactions/deploy-signed-transaction`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(serializedTxObj)
    });
    const transactionObject: TransactionObject = await request.json();
    console.log(transactionObject)

    return transactionObject
}

export async function retrievePrice(offeringId: string) {

    const request = await fetch(`${env.backplaneUrl}/semantic-engine/api/registration/contract-parameter/${offeringId}/offeringId`, {
        method: 'GET',
        headers: {
            'Accept': '*/*'
        },
    });
    const offering = await request.json();
    console.log(offering)
    const price = offering.hasPricingModel.basicPrice

    return price
}

export async function getDataBlock(dataSourceUrl: string, filename: string, blockId: string) {

    const request = await fetch(`${dataSourceUrl}/batch/getDataBlock/${filename}/${blockId}`, {
        method: 'GET',
        headers: {
            'Accept': '*/*'
        },
    });
    const response: ConnectorResponse = await request.json();

    return response
}

export async function listFiles(dataSourceUrl: string) {
    
    const request = await fetch(`${dataSourceUrl}/batch/listDataSourceFiles`, {
        method: 'GET',
        headers: {
            'Accept': '*/*'
        },
    });
    
    const response: [] = await request.json();

    return response
}

export async function fetchSignedResolution(verificationRequest: string) {

    const verification = await fetch(`${env.backplaneUrl}/conflictResolverService/verification`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "verificationRequest": verificationRequest }),
    });

    const resolution = await verification.json();
    const signedResolution = resolution.signedResolution

    return signedResolution
}

export async function getAgreement(agreementId: number) {

    const request = await fetch(`${env.smartContractManager}/get_agreement/${agreementId}`, {
        method: 'GET',
        headers: {
            'Accept': '*/*'
        },
    });
    const agreement: Agreement = await request.json();

    return agreement
}

export async function getAgreementState(agreementId: number) {

    const request = await fetch(`${env.smartContractManager}/get_state/${agreementId}`, {
        method: 'GET',
        headers: {
            'Accept': '*/*'
        },
    });
    const agreementState: AgreementState = await request.json();

    return agreementState
}

export function getTimestamp() {

    const currentDate = new Date();
    const dateFormat = `${currentDate.getFullYear()}` + '-' + ("0" + (currentDate.getMonth() + 1)).slice(-2) + '-' + ("0" + currentDate.getDate()).slice(-2)

    return dateFormat;
}

export function getFilesizeInBytes(filename: string) {

    const stats = fs.statSync(filename);
    const fileSizeInBytes = stats.size;

    return fileSizeInBytes;
}

export function checkFile(resourceMapPath: string, resourcePath: string) {
    try {
        fs.accessSync(resourceMapPath, fs.constants.F_OK);
        console.log('Map already exists');
    } catch (error) {
        const data = '{"records":[]}'
        const create = fs.appendFileSync(resourceMapPath, data);
        mapData(resourceMapPath, resourcePath);
    }
}

export function mapData(resourceMapPath: string, resourcePath: string) {

    const blockSize = env.blockSize
    const fd = fs.openSync(resourcePath, 'r')
    const fileSize = getFilesizeInBytes(resourcePath);
    const numberOfBlocks = Math.ceil(fileSize / blockSize);

    console.log(`Number of blocks: ${numberOfBlocks}`);

    const data = fs.readFileSync(resourceMapPath, 'binary');
    let map = JSON.parse(data);

    let hash = '';
    let index = 0;

    while (index < (numberOfBlocks * blockSize)) {

        const buffer = Buffer.alloc(blockSize);
        fs.readSync(fd, buffer, 0, blockSize, index)

        const content = buffer
        hash = crypto.createHash('sha256').update(content + hash).digest('hex');

        console.log(`Hash of the block is ${hash}`);

        map.records.push({ [`${hash}`]: `${index}` });
        index += blockSize;
    }
    let jsonMap = JSON.stringify(map);
    fs.writeFileSync(resourceMapPath, jsonMap);

    console.log('Map created');
}

export async function responseData(blockId: string, jsonMapOfData: JsonMapOfData, resourcePath: string) {

    let blockSize = env.blockSize

    // get index of blockId
    const keys: string[] = []
    for (let i = 0; i < jsonMapOfData.records.length; i++) {
        keys[i] = Object.keys(jsonMapOfData.records[i])[0]
    }

    const getIndex = keys.indexOf(blockId);

    // check if you got to last block
    if (getIndex + 1 === keys.length) {
        blockSize = getFilesizeInBytes(resourcePath) % blockSize;
        console.log(`The size of last block is: ${blockSize}`)
    }

    // data from coresponding offset
    const buffer = Buffer.alloc(blockSize);

    const promise = await new Promise<ResponseData>((resolve) => {

        fs.open(resourcePath, 'r+', function (err, fd) {
            if (err) {
                return console.error(err);
            }

            console.log("Reading the file");

            fs.read(fd, buffer, 0, blockSize,
                parseInt(jsonMapOfData.records[getIndex][`${blockId}`]), function (err, num) {
                    if (err) {
                        console.log(err);
                    }
                    console.log('Buffer data: ' + buffer.length)

                    if (getIndex + 1 == keys.length) {
                        resolve({ data: buffer, nextBlockId: "null" });
                    } else {
                        resolve({ data: buffer, nextBlockId: keys[getIndex + 1] })
                    }
                });
            // Close the opened file. 
            fs.close(fd, function (err) {
                if (err) {
                    console.log(err);
                }
                console.log("File closed successfully");
            });
        });
    });
    return promise;
}

export function _createJwt(claims: JwtClaims): string {
    /** This is what ends up in our JWT */
    const jwtClaims = {
        iss: config.jwt.iss,
        aud: config.jwt.aud,
        exp: Math.floor(Date.now() / 1000) + 86400, // 1 day (24×60×60=86400s) from now
        ...claims
    }
    return jwt.sign(jwtClaims, config.jwt.secret)
}
