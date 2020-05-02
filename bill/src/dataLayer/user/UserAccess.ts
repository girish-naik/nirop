import { User } from "./models/User";
import { DocumentClient, Key } from 'aws-sdk/clients/dynamodb';
import { ContactList } from "./models/ContactList";
import {createDocumentClient} from '@bit/mr-obiwankenobi.nirop-chat-helpers.tummy'

const userTableName = process.env.USER_TABLE_NAME
const userTableIndex = process.env.USER_TABLE_INDEX
const dClient:DocumentClient = createDocumentClient()

export async function saveUser(user:User) {
    await dClient.put({
        TableName : userTableName,
        Item : user
    }).promise();
}

export async function updateUser(user:User) {
    await dClient.update({
        TableName : userTableName,
        UpdateExpression : "set email = :email, displayName = :displayName",
        ExpressionAttributeValues : {
            ":email" : user.email,
            ":displayName" : user.displayName
        },
        Key : {
            uId : user.uId
        }
    }).promise();
}

export async function getUser(uId: string) : Promise <User> {
    const result = await dClient.query({
        TableName : userTableName,
        KeyConditionExpression : " #uid = :uId",
        ExpressionAttributeValues : {
            ":uId" : uId
        },
        ExpressionAttributeNames : {
            "#uid" : "uId"
        }
    }).promise();
    if (result.Count > 0) {
        const element = result.Items[0]
        return Promise.resolve({
            uId : element.uId,
            displayName : element.displayName,
            email : element.email
        })
    }
    throw Error("User not found")
}

export async function getUsers(limit: number, lastEvaluatedKey: any) : Promise <ContactList> {
    lastEvaluatedKey = getUdefinedIfInvalid(lastEvaluatedKey)
    const result = await dClient.scan({
        IndexName : userTableIndex,
        TableName : userTableName,
        ExclusiveStartKey : lastEvaluatedKey,
        Limit: limit
    }).promise();
    if (result.Count > 0) {
        const lastEvaluatedUser:User = result.LastEvaluatedKey ? transformToUser(result.LastEvaluatedKey) : emptyUser();
        return Promise.resolve({
            users : result.Items.map(function(element) {
             return {
                 "uId": element.uId,
                 "displayName": element.displayName,
                 "email" : element.email
             }
            }),
            lastEvaluatedKey : lastEvaluatedUser
        })
    } else {
        return Promise.resolve({
            users : new Array<User>(),
            lastEvaluatedKey : emptyUser()
        })
    }
}

function transformToUser(key:Key) : User {
    return {
       uId : key.uId.S,
       displayName : key.displayName.S 
    }
}

function emptyUser():User {
    return {
        uId : null,
        displayName : null
    }
}

function getUdefinedIfInvalid(lastEvaluatedKey:User) {
    if ( lastEvaluatedKey && (!lastEvaluatedKey.uId || !lastEvaluatedKey.displayName)) {
        return undefined
    }
    return lastEvaluatedKey
}