import { Router } from 'express';

const playerRouter = Router();

playerRouter.get('/', (req, res) => {
  res.send('Player route');
});

export default playerRouter;
