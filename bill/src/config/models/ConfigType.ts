import { DynamoDBConfigType } from "./DynamoDBConfigType";
import { ViewConfig } from "./ViewConfig";

export interface ConfigType {
    allowedFrontendUrl: string
    port: string
    dynamoDB : DynamoDBConfigType,
    views : ViewConfig
}