import express from 'express';

import authRouter from '@routes/auth';
import playerRouter from '@routes/player';
import scoreboardRouter from '@routes/scoreboard';
import gamesRouter from '@routes/games';

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});

app.use('/auth', authRouter);
app.use('/player', playerRouter);
app.use('/scoreboard', scoreboardRouter);
app.use('/games', gamesRouter);
