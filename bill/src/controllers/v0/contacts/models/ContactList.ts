import { User } from "../../user/models/User";

export interface ContactList {
    users: User[],
    lastEvaluatedContact: User
}