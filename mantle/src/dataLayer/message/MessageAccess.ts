import { DocumentClient, DeleteItemOutput } from "aws-sdk/clients/dynamodb";
import { Message } from "./models/Message"
import { MessageView } from "../../controllers/v0/message/models/MessageView"
import { createDocumentClient } from "@bit/mr-obiwankenobi.nirop-chat-helpers.tummy";

const dClient:DocumentClient = createDocumentClient();
const messageTableName = process.env.MESSAGE_TABLE_NAME
const udateIndex = process.env.MESSAGE_TABLE_UDATE_IDX

export async function saveMessage(message : Message) {
    await dClient.put({
        TableName: messageTableName,
        Item: message
    }).promise();
}

export async function deleteMessage(sId: string, mId: string) : Promise<string> {
    const deleteItemOutput:DeleteItemOutput = await dClient.delete({
        Key : {
            mId,
            sId
        },
        TableName: messageTableName,
        ReturnValues: "ALL_OLD"
    }).promise();
    let ext = "";
    if (deleteItemOutput.Attributes && deleteItemOutput.Attributes.ext) {
        ext = deleteItemOutput.Attributes.ext.S;
    }
    return Promise.resolve(ext);
}

export async function fetchMessages(cId: string, limit: number) : Promise<MessageView> {
    const result = await dClient.query({
        KeyConditionExpression : "cId = :cId",
        ExpressionAttributeValues : {
            ":cId" : cId
        },
        TableName: messageTableName,
        IndexName: udateIndex,
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
    
    return Promise.resolve(messageView) 
}

function createMessage(element: DocumentClient.AttributeMap): Message {
    return {
        mId : element.mId,
        cId : element.cId,
        sId : element.sId,
        cDate : element.cDate,
        message : element.message,
        ext : element.ext
    };
}