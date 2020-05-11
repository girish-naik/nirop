import { createDocumentClient, batchWrite } from '@bit/mr-obiwankenobi.nirop-chat-helpers.tummy';

import { DocumentClient, Key, BatchWriteItemInput } from "aws-sdk/clients/dynamodb";
import { Conversation } from "../models/Conversation";
import { ConversationView } from "../models/ConversationView";
import { ConversationViews } from "../models/ConversationViews";

const dClient:DocumentClient = createDocumentClient();
const convoTableName = process.env.CONVERSATION_TABLE_NAME
const uDateIndex = process.env.CONVERSATION_TABLE_UDATE_IDX
const cidIndex = process.env.CONVERSATION_TABLE_CID_IDX
export async function saveConversations(convos: Conversation[]) {
    var params:BatchWriteItemInput = {
        RequestItems : {
        }
    };
    params.RequestItems[convoTableName] = convos.map(transformToPutRequest);
    await batchWrite(params);
}

export async function getConversation(cId: string, pId: string) : Promise<ConversationView> {
    const cResult = await dClient.query({
        KeyConditionExpression : "pId = :pId and cId = :cId",
        ExpressionAttributeValues : {
            ":pId" : pId,
            ":cId" : cId
        },
        TableName: convoTableName
    }).promise();
    if (cResult.Count > 0) {
        const uDate = cResult.Items[0].uDate;
        const result = await dClient.query({
            KeyConditionExpression : "cId = :cId",
            ExpressionAttributeValues : {
                ":cId" : cId
            },
            TableName: convoTableName,
            IndexName: cidIndex
        }).promise();
        const participants : string[] = [];
        result.Items.forEach(element => {
            if (element.pId != pId)
                participants.push(element.pId);
        });
        return Promise.resolve({cId, participants, uDate});
    }
    return Promise.resolve(undefined);
}

export async function getAllConversations(pId: string, limit: number, lastEvaluatedKey: Conversation) : Promise<ConversationViews> {
    lastEvaluatedKey = getUndefinedIfInvalid(lastEvaluatedKey)
    const conversationResult = await dClient.query({
        KeyConditionExpression : "pId = :pId",
        ExpressionAttributeValues : {
            ":pId" : pId
        },
        TableName: convoTableName,
        IndexName: uDateIndex,
        Limit : limit,
        ExclusiveStartKey : lastEvaluatedKey
    }).promise();
    const lastEvaluatedConversation:Conversation = conversationResult.LastEvaluatedKey ? transformToConversation(conversationResult.LastEvaluatedKey) : emptyConversation();
    if (conversationResult.Count > 0) {
        const uDate = conversationResult.Items[0].uDate;
        const conversationViews: ConversationView[] = [];
        for (var i = 0; i < conversationResult.Count; i++) {
            const cId = conversationResult.Items[i].cId;
            const participantResult = await dClient.query({
                KeyConditionExpression : "cId = :cId",
                ExpressionAttributeValues : {
                    ":cId" : cId
                },
                TableName: convoTableName,
                IndexName: cidIndex
            }).promise();
            const participants : string[] = [];
            participantResult.Items.forEach(pResult => {
                if (pResult.pId != pId)
                    participants.push(pResult.pId);
            });
            conversationViews.push({cId, participants, uDate})
        }
        return Promise.resolve({lastEvaluatedConversation, conversationViews});
    } else {
        return Promise.resolve({
            conversationViews : new Array<ConversationView>(),
            lastEvaluatedConversation : emptyConversation()
        })
    }
}

function getUndefinedIfInvalid(lastEvaluatedKey:Conversation) {
    if ( lastEvaluatedKey && (!lastEvaluatedKey.cId || !lastEvaluatedKey.uDate || !lastEvaluatedKey.pId)) {
        return undefined
    }
    return lastEvaluatedKey
}

function transformToConversation(key:Key) : Conversation {
    const cId = key.cId;
    return {
       cId : key.cId.toString(),
       pId : key.pId.toString(),
       uDate : key.uDate.toString()
    }
}

function emptyConversation() : Conversation {
    return {
        cId : null,
        pId : null,
        uDate : null
    }
}

function transformToPutRequest(conversation: Conversation) {
    return {
        PutRequest: {
            Item: {
                "pId": { "S": conversation.pId },
                "cId": { "S": conversation.cId },
                "uDate": { "S": conversation.uDate }
            }
        }
    };
}
