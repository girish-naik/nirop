import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import {createConfig} from "../config/util"
import { ConfigType } from '../config/models/ConfigType';

const config:ConfigType = createConfig()

export function createDocumentClient(): DocumentClient {
    if (process.env.IS_OFFLINE) {
        console.log("Using local AWS DynamoDB client")
        return new AWS.DynamoDB.DocumentClient(config.dynamoDB.localConnectionParams);
    } else {
        return new AWS.DynamoDB.DocumentClient();
    }
}