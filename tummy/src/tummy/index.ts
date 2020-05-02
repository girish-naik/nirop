import { verify, decode, JwtHeader } from 'jsonwebtoken'
import Axios from 'axios'
import { AxiosResponse } from 'axios'
import * as AWS from 'aws-sdk'
import DynamoDB, { DocumentClient } from 'aws-sdk/clients/dynamodb';

export interface Jwt {
    header: JwtHeader
    payload: JwtPayload
}

export interface JwtPayload {
    iss: string
    sub: string
    iat: number
    exp: number
}

export interface AppServiceConfigType {
    Tables: DynamoDBTableConfigType
}

export interface Auth0ConfigType {
    [key: string]: any
}

export interface ConfigType {
    allowedFrontendUrl: string
    port: string
    dynamoDB: DynamoDBConfigType,
    auth0: Auth0ConfigType
    views: ViewConfig
}

export interface DynamoDBConfigType {
    localConnectionParams: any
    Services: {
        [key: string]: AppServiceConfigType
    }
}

export interface DynamoDBTableConfigType {
    [key: string]: any
}

export interface ViewConfig {
    [key: string]: any
}

export interface JkwsKey {
    use : string,
    kty : string,
    kid : string,
    x5c : string[],
    n : string,
    e : string,
    nbf :string
}

export interface AppJkwsKey {
    kid : string,
    nbf :string,
    publicKey : string
}

const config: ConfigType = {
    allowedFrontendUrl: "http://localhost:3000",
    port: process.env.PORT,
    views: {
        "contacts": {
            pageLength: 10
        }
    },
    dynamoDB: {
        localConnectionParams: {
            endpoint: "http://localhost:8000",
            region: "us-east-1"
        },
        Services: {
            "user": {
                Tables: {
                    "UserTable": {
                        TableName: process.env.USER_TABLE_NAME,
                        KeySchema: [
                            { AttributeName: "uId", KeyType: "HASH" }
                        ],
                        AttributeDefinitions: [
                            { AttributeName: "uId", AttributeType: "S" }, 
                            { AttributeName: "displayName", AttributeType: "S" }
                        ],
                        GlobalSecondaryIndexes: [
                            {
                                "IndexName": process.env.USER_TABLE_INDEX,
                                "KeySchema": [
                                    {
                                        "AttributeName": "uId",
                                        "KeyType": "HASH"
                                    },
                                    {
                                        "AttributeName": "displayName",
                                        "KeyType": "SORT"
                                    }
                                ],
                                "Projection": {
                                    "ProjectionType": "ALL"
                                },
                                "ProvisionedThroughput": {
                                    "ReadCapacityUnits": 1,
                                    "WriteCapacityUnits": 1
                                }
                            }
                        ],
                        BillingMode: "PAY_PER_REQUEST"
                    }
                }
            }
        }
    },
    auth0: {
        "jwksUrl": process.env.JWKS_URL
    }
}

export const appConfig: ConfigType = config;

export async function fetchSigningKeys(): Promise<AppJkwsKey[]> {
    const response: AxiosResponse = await Axios.get(appConfig.auth0.jwksUrl);
    var keys:JkwsKey[] = response.data.keys;
    if (!keys || !keys.length) {
        throw new Error('The JWKS endpoint did not contain any keys');
    }
    const signingKeys: AppJkwsKey[] = keys.filter(key => key.use === 'sig' // JWK property `use` determines the JWK is for signing
        && key.kty === 'RSA' // We are only supporting RSA (RS256)
        && key.kid           // The `kid` must be present to be useful for later
        && ((key.x5c && key.x5c.length) || (key.n && key.e)) // Has useful public keys
    ).map(key => {
        return { kid: key.kid, nbf: key.nbf, publicKey: certToPEM(key.x5c[0]) };
    });
    return Promise.resolve(signingKeys);
}

export async function verifyToken(signingKeys: AppJkwsKey[], authHeader: string): Promise<JwtPayload> {
    const token = getToken(authHeader)
    const jwt: Jwt = decode(token, { complete: true }) as Jwt
    if (!jwt || !jwt.payload || !jwt.header) {
        throw new Error('Invalid or Expired token.')
    }
    const kid = jwt.header.kid;
    const signingKey:AppJkwsKey = signingKeys.find(key => key.kid === kid);
    const certificate: { publicKey: string } = signingKey;
    try {
        verify(token, certificate.publicKey, { algorithms: ["RS256"] });
        return Promise.resolve(jwt.payload);
    } catch (err) {
        throw new Error(err);
    }
}

export function createDocumentClient(): DocumentClient {
    if (process.env.IS_OFFLINE) {
        console.log("Using local AWS DynamoDB client")
        return new AWS.DynamoDB.DocumentClient(appConfig.dynamoDB.localConnectionParams);
    } else {
        return new AWS.DynamoDB.DocumentClient();
    }
}

export async function createTables(serviceName: string) {
    const dynamoDBConfig = appConfig.dynamoDB;
    if (process.env.IS_OFFLINE) {
        const dynamoDB: DynamoDB = new DynamoDB(dynamoDBConfig.localConnectionParams);
        const service: AppServiceConfigType = dynamoDBConfig.Services[serviceName];
        if (service) {
            const tableConfig: DynamoDBTableConfigType = service.Tables;
            const keys: string[] = Object.keys(tableConfig);
            for (var i = 0; i < keys.length; i++) {
                const key = keys[i];
                try {
                    console.log("Creating table - " + key)
                    await dynamoDB.describeTable({
                        TableName: tableConfig[key].TableName
                    }).promise()
                    console.log("Table already exists - " + key)
                } catch (err) {
                    await dynamoDB.createTable(tableConfig[key]).promise();
                }
            }
        }
    }
}

function certToPEM(cert: string) {
    cert = cert.match(/.{1,64}/g).join('\n');
    cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
    return cert;
}

function getToken(authHeader: string): string {
    if (!authHeader) throw new Error('No authentication header')

    if (!authHeader.toLowerCase().startsWith('bearer '))
        throw new Error('Invalid authentication header')

    const split = authHeader.split(' ')
    const token = split[1]

    if (!token || token.length == 0) {
        throw new Error('Blank token')
    }

    return token
}

