import { createDocumentClient } from "../cloud/aws"
import DynamoDB, { DocumentClient } from "aws-sdk/clients/dynamodb";
import {createConfig} from "../config/util"
import { ConfigType } from "../config/models/ConfigType";

export async function createTables() {
    const appConfig:ConfigType = createConfig();
    const tableConfig = appConfig.dynamoDB.Tables;
    if (process.env.IS_OFFLINE) {
        const dynamoDB:DynamoDB = new DynamoDB(appConfig.dynamoDB.localConnectionParams);
        const keys:string[] = Object.keys(tableConfig);
        for (var i = 0; i < keys.length ; i++) {
            const key = keys[i];
            
            try {
                console.log("Creating table - " + key)
                await dynamoDB.describeTable({
                    TableName : tableConfig[key].TableName
                }).promise()
                console.log("Table already exists - " + key)
            } catch(err) {
                await dynamoDB.createTable(tableConfig[key]).promise();
            }
        }
    }
}