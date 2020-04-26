import { DynamoDBTableConfigType } from "./DynamoDBTableConfigType";

export interface DynamoDBConfigType {
    localConnectionParams : any
    Tables : DynamoDBTableConfigType
}