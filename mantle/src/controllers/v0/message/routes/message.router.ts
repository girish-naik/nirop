import { Router, Request, Response, NextFunction } from 'express';
import { SendMessageRequest } from '../models/SendMessageRequest';
import { Message } from '../models/Message';
import * as MessageService from '../../../../businessLayer/MessageService'
import { MessageView } from '../models/MessageView';

const router: Router = Router();

router.post("/", validateAndParseSendRequest, async function(req:Request, res:Response, next: NextFunction){
    const uId:string = res.locals.jwtPayload.sub;
    const sendMessageReq:SendMessageRequest = res.locals.sendMessageReq;
    try {
        const message:Message = await MessageService.saveMessage(uId, sendMessageReq);
        res.status(201).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            msg : "Failed to save message."
        })
    }
});

router.get("/message/:mId", async function(req:Request, res:Response, next: NextFunction) {
    const uId:string = res.locals.jwtPayload.sub;
    const { mId } = req.params;
    if (!mId) {
        res.status(422).send({msg : "Invalid request."})
    }
    try {
        const message:Message = await MessageService.fetchMessage(uId, mId);
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            msg : "Failed to fetch messages."
        });
    }

});

router.get("/:cId", async function(req:Request, res:Response, next: NextFunction){
    const uId:string = res.locals.jwtPayload.sub;
    const { cId } = req.params;
    if (!cId) {
        res.status(422).send({msg : "Invalid request."});
    }
    try {
        const messageView:MessageView = await MessageService.fetchMessages(uId, cId, 100);
        res.status(201).send(messageView);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            msg : "Failed to fetch messages."
        })
    }
});

router.delete("/:mId", async function(req:Request, res:Response, next: NextFunction) {
    const uId:string = res.locals.jwtPayload.sub;
    const { mId } = req.params;
    if (!mId) {
        res.status(422).send({message : "Invalid message delete request."});
    }
    try {
        await MessageService.deleteMessage(uId, mId);
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send({
            msg : "Failed to delete message."
        })
    }
});

function validateAndParseSendRequest(req:Request, res:Response, next: NextFunction){
    const { cId, message, ext} = req.body;
    if (!cId || !message) {
        res.status(422).send({message : "Invalid message send request."})
    }
    const sendMessageReq:SendMessageRequest = {
        cId,
        message,
        ext
    }
    res.locals.sendMessageReq = sendMessageReq;
    next();
}

export const MessageRouter: Router = router;