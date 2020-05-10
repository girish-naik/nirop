import { Chat } from "./Chat";
import { LastChat } from "./LastChat";

export interface Chats {
    chats : Chat[],
    lastChat : LastChat
}