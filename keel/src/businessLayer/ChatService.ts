import { ChatView } from "../controllers/v0/chat/models/ChatView";
import { Chat } from "../controllers/v0/chat/models/Chat";
import * as dataLayer from "../dataLayer/ConversationAccess"
import { Conversation } from "../models/Conversation";
import { ConversationViews } from "../models/ConversationViews";
import { ConversationView } from "../models/ConversationView";
import sha256 from 'crypto-js/sha256';
import { LastChat } from "../controllers/v0/chat/models/LastChat";

export async function fetchChats(uId: string, limit: number, lastChat: LastChat): Promise<ChatView> {
    return transforToChatView(await dataLayer.getAllConversations(uId, limit, transfromToConversation(lastChat)));
}

export async function startChat(uId: string, participants: string[]): Promise<Chat> {
    const hashDigest = sha256(joinParticipants(participants.sort())).toString();
    const conversation: ConversationView = await dataLayer.getConversation(hashDigest, uId);
    if (conversation) {
        return transformToChatFromView(conversation);
    }
    const uDate = Date.now().toString()
    const conversations:Conversation[] = participants.map(pId => createConversation(pId, hashDigest, uDate));
    await dataLayer.saveConversations(conversations);
    return {cId : hashDigest, uDate, participants : participants.filter((pId) => pId !== uId)};
}

function joinParticipants(participants: string[]): string {
    return participants.join("_");
}

function transfromToConversation(lastChat: LastChat): Conversation {
    return {
        cId: lastChat.cId,
        uDate: lastChat.uDate,
        pId: lastChat.pId
    }
}

function transfromToLastChat(lastConvo: Conversation): LastChat {
    return {
        cId: lastConvo.cId,
        pId: lastConvo.pId,
        uDate: lastConvo.uDate
    }
}

function transformToChatFromView(conversationView: ConversationView): Chat {
    return {
        cId: conversationView.cId,
        uDate: conversationView.uDate,
        participants: conversationView.participants
    }
}

function transforToChatView(conversationViews: ConversationViews): ChatView {
    return {
        lastChat: transfromToLastChat(conversationViews.lastEvaluatedConversation),
        chats: conversationViews.conversationViews.map(transformToChatFromView)
    }
}

function createConversation(pId: string, cId: string, uDate: string): Conversation {
    return {
        pId,
        cId,
        uDate
    }
}