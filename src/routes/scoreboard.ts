import { Router } from 'express';

const scoreboardRouter = Router();

scoreboardRouter.get('/', (req, res) => {
  res.send('Scoreboard route');
});

export default scoreboardRouter;
