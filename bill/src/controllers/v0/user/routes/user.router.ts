import { Router, Request, Response, NextFunction } from 'express';

import { User } from '../models/User';

import * as EmailValidator from 'email-validator';

import * as UserService from '../../../../businessLayer/UserService'

const router: Router = Router();

router.post("/", parseUser, validateUser, async (req:Request, res:Response) => {
    const user:User = res.locals.user;
    try {
        await UserService.saveUser(user);
        res.status(201).send()
    } catch(err) {
        res.status(404).send({
            message : "Failed to create user."
        })
    }
})

router.put("/", parseUser, validateUser, async (req:Request, res:Response) => {
    const user:User = res.locals.user;
    try {
        await UserService.updateUser(user);
        res.status(200).send()
    } catch(err) {
        console.log(err)
        res.status(404).send({
            message : "Failed to update user."
        })
    }
})

router.get("/", async (req:Request, res:Response) => {
    const uId:string = res.locals.jwtPayload.sub;
    try {
        const user:User = await UserService.getUser(uId)
        res.status(200).send({
            user : user
        })
    } catch (err) {
        console.log(err)
        res.status(404).send({
            message : "Failed to fetch user."
        })
    }
})

function parseUser(req:Request, res:Response, next:NextFunction) {
    res.locals.user = {
        uId: res.locals.jwtPayload.sub,
        displayName : req.body.displayName,
        email : req.body.email
    }
    next()
}

function validateUser(req:Request, res:Response, next:NextFunction) {
    const user:User = res.locals.user;
    if (!user.uId) {
        res.status(401).send({message: "User not authenticated."});
    } else if (!user.displayName || !user.email) {
        res.status(402).send({message: "Display name and email are required."})
    } else if (!EmailValidator.validate(user.email)) {
        res.status(402).send({message: "Invalid email."})
    } else {
        next()
    }
}


export const UserRouter: Router = router;