import {createTables} from '@bit/mr-obiwankenobi.nirop-chat-helpers.tummy';

export async function syncSchemas() {
    await createTables("conversation");
}