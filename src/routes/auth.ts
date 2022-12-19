import { Request, Response, Router } from 'express';

const authRouter = Router();

authRouter.post('/login', (req: Request, res: Response) => {
  res.send('Login route');
});

export default authRouter;
