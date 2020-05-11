import Axios from "axios";
import { apiConfig } from "../../config/config";
import { MessageView } from "./models/MessageView";
import { SendMessageRequest } from "./models/SendMessageRequest";
import { SendMessageResponse } from "./models/SendMessageResponse";

const apiEndpoint = apiConfig.message.apiEndpoint;

export async function fetchMessages(idToken: string, cId: string): Promise<MessageView|undefined> {
    try {
        const response = await Axios.get(`${apiEndpoint}/` + cId,
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${idToken}`
            }
        })
        return response.data;
    } catch (err) {
        return undefined;
    }
}

export async function deleteMessage(idToken: string, mId: string): Promise<boolean> {
    try {
        await Axios.delete(`${apiEndpoint}/` + mId,
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${idToken}`
            }
        })
        return true;
    } catch (err) {
        return false;
    }
}

export async function sendMessage(idToken: string, message: SendMessageRequest): Promise<SendMessageResponse|undefined> {
    try {
    const response = await Axios.post(`${apiEndpoint}/`,
        message,
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${idToken}`
            }
        })
        return response.data;
    } catch (err) {
        return undefined;
    }
}