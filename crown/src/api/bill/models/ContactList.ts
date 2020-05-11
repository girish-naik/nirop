import { User } from "../models/User";

export interface ContactList {
    users: User[],
    lastEvaluatedContact?: User
}