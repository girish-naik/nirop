import { createDocumentClient } from "../cloud/aws";
import { DocumentClient, DeleteItemOutput } from "aws-sdk/clients/dynamodb";
import { Conversation } from "../models/Conversation";
import { ConversationView } from "../models/ConversationView";

const dClient:DocumentClient = createDocumentClient();
const convoTableName = process.env.CONVERSATION_TABLE_NAME
const senderIndex = process.env.CONVERSATION_TABLE_SENDER_IDX

export async function saveConversation(convo: Conversation) {
    await dClient.put({
        TableName: convoTableName,
        Item: convo
    }).promise();
}

export async function getConversation(cId: string, sId: string) : Promise<ConversationView> {
    const result = await dClient.query({
        KeyConditionExpression : "cId = :cId and sId = :sId",
        ExpressionAttributeValues : {
            cId,
            sId
        },
        TableName: convoTableName,
        IndexName: senderIndex
    }).promise();

    if (result.Count > 0) {
        const result = await dClient.query({
            KeyConditionExpression : "cId = :cId and sId = :sId",
            ExpressionAttributeValues : {
                cId,
                sId
            },
            TableName: convoTableName,
            IndexName: senderIndex
        }).promise();
        const participants : string[] = [];
        result.Items.forEach(element => {
            if (element.sId != sId)
                participants.push(element.sId);
        });
        return Promise.resolve({cId, participants});
    }
    return Promise.resolve(undefined);
}

