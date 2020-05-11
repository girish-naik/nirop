import { apiConfig } from '../../config/config'
import Axios from 'axios'
import { User } from './models/User';

const apiEndpoint = apiConfig.user.apiEndpoint;
export async function getUserDetails(idToken: string): Promise<User|undefined> {
    try {
        const response = await Axios.get(`${apiEndpoint}`, 
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${idToken}`
            }
        })
        return response.data.user ? response.data.user : response.data;
    } catch (err) {
        return undefined;
    }
}

export async function saveUser(idToken: string, displayName: string, email:string): Promise<boolean> {
    try {
        await Axios.post(`${apiEndpoint}`, {
            displayName,
            email
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${idToken}`
            }
        })
        return true;
    } catch (err) {
        console.log(err)
        return false;
    }
}