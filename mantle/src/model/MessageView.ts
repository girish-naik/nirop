import {Message} from "./message"

export interface MessageView {
    lastMessageId?: string,
    messages: Message[]
}