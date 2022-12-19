import { Router } from 'express';

const gamesRouter = Router();

gamesRouter.get('/', (req, res) => {
  res.send('Games route');
});

export default gamesRouter;
