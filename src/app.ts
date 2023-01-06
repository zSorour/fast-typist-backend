import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRouter from '@features/auth/Auth.router';
import handleError from '@middlewares/errorHandler';

dotenv.config();

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});

app.use('/auth', authRouter);

app.use(handleError);
