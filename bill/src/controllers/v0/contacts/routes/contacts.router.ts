import { Router, Request, Response, NextFunction } from "express";
import * as UserService from "../../../../businessLayer/UserService";
import { createConfig } from "../../../../config/util";

const router: Router = Router();
const config = createConfig()
const contactViewConfig = config.views["contacts"]
router.post("/", async(req:Request, res:Response, next:NextFunction) => {
    try {
        const {uId, displayName} = req.body;
        const results = await UserService.getUsers(res.locals.jwtPayload.sub, contactViewConfig.pageLength, {uId, displayName})
        res.status(200).send(results)
    } catch (err) {
        console.log(err)
        res.status(404).send({
            message: "Failed to fetch contacts."
        })
    }
})

export const ContactsRouter: Router = router; 