import { apiConfig } from '../../config/config'
import Axios from 'axios'
import { Chat } from './models/Chat';
import { Chats } from './models/Chats';
import { LastChat } from './models/LastChat';

const apiEndpoint = apiConfig.chat.apiEndpoint;
export async function startChat(idToken: string, participants: string[]): Promise<Chat|undefined> {
    try {
        const response = await Axios.post(`${apiEndpoint}/start`, 
        {
            participants
        },
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

export async function getChats(idToken: string, lastChat: LastChat|undefined): Promise<Chats|undefined> {
    try {
        const url = !lastChat ?  `${apiEndpoint}` : `${apiEndpoint}` + "?cId" + lastChat.cId + "&uDate" + lastChat.uDate + "&pId" + lastChat.pId;
        const response = await Axios.get(url, 
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