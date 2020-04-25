import { Router, Request, Response } from 'express';
import { ChatRouter } from './chat/routes/chat.router';

const router: Router = Router();

router.use('/chat', ChatRouter);

router.get('/', async (req: Request, res: Response) => {    
    res.send(`V0`);
});

export const IndexRouter: Router = router;