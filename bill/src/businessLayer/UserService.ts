import { User } from "../controllers/v0/user/models/User";
import { User as UserDO } from "../dataLayer/user/models/User";
import {ContactList as ContactListDO} from "../dataLayer/user/models/ContactList";
import * as UserAccess from "../dataLayer/user/UserAccess"
import { ContactList } from "../controllers/v0/contacts/models/ContactList";

export async function saveUser(user : User) {
    await UserAccess.saveUser(transformToUserDo(user))
}

export async function getUser(uId : string) : Promise<User> {
    return transformToUser(await UserAccess.getUser(uId))
}

export async function getUsers(uId : string, limit : number, lastContact: User) : Promise<ContactList> {
    return transformToContactList(uId, await UserAccess.getUsers(limit, transformToUserDo(lastContact)))
}

export async function updateUser(user : User) {
    await UserAccess.updateUser(transformToUserDo(user));
}

function transformToUserDo(user:User) : UserDO {
    return {
        ...user
    }
}

function transformToContactList(uId:string, view:ContactListDO) : ContactList {
    return {
        users : view.users.filter(function (element) {
           return element.uId !== uId
        }).map(function(element){
            return transformToUser(element)
        }),
        lastEvaluatedContact : transformToUser(view.lastEvaluatedKey)
    }
}

function transformToUser(user:UserDO) : User {
    return {
        ...user
    }
}