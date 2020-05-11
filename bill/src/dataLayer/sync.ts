import {createTables} from '@bit/mr-obiwankenobi.nirop-chat-helpers.tummy';
import { saveUser } from './user/UserAccess';

export async function syncSchemas() {
    await createTables("user");
    await saveUser({
        uId : "999c445c-c928-43bf-a633-787ca25053c1",
        displayName : "Biswas Jones",
        email : "biswasjones@nirop.com"
    })
    await saveUser({
        uId : "96774a40-6131-4bc8-8fb0-4959cc619080",
        displayName : "Alex Jones",
        email : "alex.jones@nirop.com"
    })
    await saveUser({
        uId : "4cb20194-708a-486c-bfd4-703e8fca9d85",
        displayName : "Saul Goodman",
        email : "saul.goswami@nirop.com"
    })
    await saveUser({
        uId : "fa81dad7-da04-4031-a2f6-1fce2fc0ddda",
        displayName : "Devi Alex",
        email : "devi.alex@nirop.com"
    })
    await saveUser({
        uId : "1932e9f2-33ac-46ab-a388-ddaa917b0488",
        displayName : "Hasan Bran",
        email : "hasan.bran@nirop.com"
    })
    await saveUser({
        uId : "918f5568-6833-49be-ac1d-ab94c8b6949d",
        displayName : "Jimmy Kimmel",
        email : "jimmy.kimmel@nirop.com"
    })
    await saveUser({
        uId : "93106888-5ee1-4c42-90b5-c0a5fb1da077",
        displayName : "Britanny Caroll",
        email : "b.caroll@republiq.com"
    })
    await saveUser({
        uId : "2bc68611-970b-4661-8cd1-c407b962e383",
        displayName : "Carol Baskin",
        email : "c.baskin@nirop.com"
    })
    await saveUser({
        uId : "510a8421-38e8-487e-9e5b-10f333e3f423",
        displayName : "Sonia G",
        email : "gsonia@nirop.com"
    })
    await saveUser({
        uId : "55cdaf19-6cf1-4785-b155-6e331c4e6648",
        displayName : "Rick Guy",
        email : "d.guy@nirop.com"
    })
    
}