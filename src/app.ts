import express from 'express';

import authRouter from '@routes/auth';
import handleError from '@middlewares/errorHandler';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});

app.use('/auth', authRouter);

app.use(handleError);
