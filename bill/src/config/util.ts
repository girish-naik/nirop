import { ConfigType } from "./models/ConfigType"

export function createConfig(): ConfigType { 
    return {
        allowedFrontendUrl : "http://localhost:3000",
        port : process.env.PORT,
        views : {
            "contacts" : {
                pageLength : 10
            }
        },
        dynamoDB : {
            localConnectionParams : {
                endpoint : "http://localhost:8000",
                region : "us-east-1"
            },
            Tables : {
                "UserTable" : {
                    TableName : process.env.USER_TABLE_NAME,
                    KeySchema : [{AttributeName:"uId", KeyType : "HASH"}, {AttributeName:"displayName", KeyType : "SORT"}],
                    AttributeDefinitions : [{AttributeName:"uId", AttributeType: "S"}, {AttributeName:"displayName", AttributeType: "S"}],
                    BillingMode : "PAY_PER_REQUEST"
                }
            }
        }
    }
}