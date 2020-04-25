import { Router, Request, Response } from 'express';
import { MessageRouter } from './message/routes/message.router';

const router: Router = Router();

router.use('/message', MessageRouter);

router.get('/', async (req: Request, res: Response) => {    
    res.send(`V0`);
});

export const IndexRouter: Router = router;