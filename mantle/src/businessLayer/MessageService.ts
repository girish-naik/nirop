import { SendMessageRequest } from '../controllers/v0/message/models/SendMessageRequest'
import { Message as MessageDO } from '../dataLayer/message/models/Message'
import { Message } from '../controllers/v0/message/models/Message'
import * as dataLayer from '../dataLayer/message/MessageAccess'
import * as uuid from 'uuid'
import { getPutSignedUrl, getGetSignedUrl, getAttachmentsFileStore, deleteAttachment } from '@bit/mr-obiwankenobi.nirop-chat-helpers.tummy'
import { MessageView } from '../controllers/v0/message/models/MessageView'

const fileStore = getAttachmentsFileStore();

export async function saveMessage(uId: string, message: SendMessageRequest) {
    const mId: string = uuid.v4();
    const cDate = Date.now().toString()
    const messageDO: MessageDO = convertToMessageDO(mId, uId, cDate, message);
    await dataLayer.saveMessage(messageDO);
    let url;
    if (message.ext && message.ext.trim().length > 0) {
        url = getPutSignedUrl(mId)
    }
    return convertToMessage(messageDO, url);
}

export async function fetchMessages(uId: string, cId: string, limit: number): Promise<MessageView> {
    const messageDOView: MessageView = await dataLayer.fetchMessages(cId, limit);
    return { messages: messageDOView.messages.map((message) => convertToMessageWithUrl(message)) };
}

export async function deleteMessage(uId: string, mId: string) {
    const ext: string = await dataLayer.deleteMessage(uId, mId);
    if (ext && ext.trim().length > 0) {
        await deleteAttachment(mId);
    }
    return Promise.resolve();
}

function convertToMessageDO(mId: string, sId: string, cDate: string, message: SendMessageRequest): MessageDO {
    return {
        mId,
        sId,
        cDate,
        ...message
    }
}

function convertToMessageWithUrl(messageDO: MessageDO): Message {
    let url;
    if (messageDO.ext && messageDO.ext.trim().length > 0) {
        url = getGetSignedUrl(messageDO.mId);
    }
    return {
        ...messageDO,
        url
    }
}

function convertToMessage(messageDO: MessageDO, url: string | undefined): Message {
    return {
        ...messageDO,
        url
    }
}