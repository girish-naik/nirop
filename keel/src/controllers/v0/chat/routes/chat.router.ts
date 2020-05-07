import { Router, Request, Response, NextFunction } from 'express';
import * as ChatService from "../../../../businessLayer/ChatService"
import { appConfig } from "@bit/mr-obiwankenobi.nirop-chat-helpers.tummy";
import { Chat } from '../models/Chat';

const router: Router = Router();
const chatViewConfig = appConfig.views["chats"]
router.get("/", async function(req:Request, res:Response) {
    const uId:string = res.locals.jwtPayload.sub;
    const cId:string = req.query.cId ? req.query.cId.toString() : undefined;
    const pId:string = req.query.pId ? req.query.pId.toString() : undefined;
    const uDate:string = req.query.uDate ? req.query.uDate.toString() : undefined;
    try {
        const results = await ChatService.fetchChats(uId, chatViewConfig.pageLength, {cId, pId, uDate});
        res.status(200).send(results);
    } catch(err) {
        console.log(err)
        res.status(404).send({
            message : "Error retrieving chats for user."
        })
    }
});

router.post("/start", validateParticipants, async function(req:Request, res:Response) {
    const uId:string = res.locals.jwtPayload.sub;
    const participants: string[] = req.body.participants;
    participants.push(uId);
    try {
        const chat:Chat = await ChatService.startChat(uId, participants);
        res.status(201).send(chat);
    } catch (err) {
        console.log(err)
        res.status(404).send({
            message : "Failed to start chat."
        })
    }
});

function validateParticipants(req:Request, res:Response, next: NextFunction) {
    const participants: string[] = req.body.participants;
    if (!participants) {
        res.status(404).send({
            message : "No list of participants found."
        })
    }
    next();
}

export const ChatRouter: Router = router;