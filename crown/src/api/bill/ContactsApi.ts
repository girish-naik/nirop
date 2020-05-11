import { apiConfig } from '../../config/config'
import { ContactList } from './models/ContactList';
import Axios from 'axios'
import { User } from './models/User';

const apiEndpoint = apiConfig.contacts.apiEndpoint;
export async function getContactList(idToken: string, uId?: string, displayName?: string): Promise<ContactList> {
    const response = await Axios.post(`${apiEndpoint}`, JSON.stringify({
        uId,
        displayName
    }), 
    {
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${idToken}`
        }
    })
    return convertToContactList(response.data)
}

function convertToContactList(data:any) {
    if (data.users) {
        const users:User[] = data.users.map(function(e:any, i:number){
            return {
                id : e.uId,
                displayName : e.displayName,
                email : e.email
            }
        });
        let lastEvaluatedContact;
        if (data.lastEvaluatedContact) {
            lastEvaluatedContact = {
                id : data.lastEvaluatedContact.uId,
                displayName : data.lastEvaluatedContact.displayName,
                email : data.lastEvaluatedContact.email
            }
        }
        return {
            users,
            lastEvaluatedContact
        }
    } else {
        return {
            users : new Array<User>()
        }
    }
}