import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRouter from '@routes/auth';
import handleError from '@middlewares/errorHandler';

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});

app.use('/auth', authRouter);

app.use(handleError);
