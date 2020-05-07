import { Chat } from "./Chat";
import { LastChat } from "./LastChat";

export interface ChatView {
    lastChat : LastChat,
    chats : Chat[]
}