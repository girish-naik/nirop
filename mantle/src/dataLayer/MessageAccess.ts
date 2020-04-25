import { createDocumentClient } from "../cloud/aws";
import { DocumentClient, DeleteItemOutput } from "aws-sdk/clients/dynamodb";
import { Message } from "../model/Message"
import { MessageView } from "../model/MessageView"

const dClient:DocumentClient = createDocumentClient();
const messageTableName = process.env.MESSAGE_TABLE_NAME
const conversationIndex = process.env.MESSAGE_TABLE_CONV_IDX

export async function saveMessage(message : Message) {
    await dClient.put({
        TableName: messageTableName,
        Item: message
    }).promise();
}

export async function deleteMessage(sId: string, cId: string, mId: string) : Promise<string> {
    const deleteItemOutput:DeleteItemOutput = await dClient.delete({
        Key : {
            mId,
            sId,
            cId
        },
        TableName: messageTableName,
        ReturnValues: "ALL_OLD"
    }).promise();

    return Promise.resolve(deleteItemOutput.Attributes.aExt.S);
}

export async function fetchMessages(cId: string, mId: string, limit: number) : Promise<MessageView> {
    const result = await dClient.query({
        KeyConditionExpression : "cId = :cId",
        ExpressionAttributeValues : {
            cId
        },
        TableName: messageTableName,
        IndexName: conversationIndex,
        ExclusiveStartKey: {
            mId,
            cId
        },
        ScanIndexForward: false,
        Limit: limit
    }).promise();

    const messages : Message[] = [];
    result.Items.forEach(element => {
        messages.push(createMessage(element));
    });

    const messageView : MessageView = {
        messages
    }

    if (result.LastEvaluatedKey) {
        messageView.lastMessageId = result.LastEvaluatedKey.mId;
    }
    
    return Promise.resolve(messageView) 
}

function createMessage(element: DocumentClient.AttributeMap): Message {
    return {
        mId : element.mId,
        cId : element.cId,
        sId : element.sId,
        cDate : element.cDate,
        aExt : element.aExt
    };
}