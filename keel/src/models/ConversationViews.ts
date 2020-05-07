import { ConversationView } from "./ConversationView";
import { Conversation } from "./Conversation";

export interface ConversationViews {
    lastEvaluatedConversation : Conversation,
    conversationViews : ConversationView[]
}