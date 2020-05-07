import {User} from './User'
export interface ContactList {
    users: User[],
    lastEvaluatedKey: User
}