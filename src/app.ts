import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRouter from '@features/auth/Auth.router';
import handleError from '@middlewares/errorHandler';
import initSocketServer from '@config/io';

dotenv.config();

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use('/auth', authRouter);
app.use(handleError);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server is now listening to port: ${PORT}`);
  initSocketServer(server);
});
