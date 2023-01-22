import { Server } from 'http';
import { Namespace, Socket, Server as SocketIOServer } from 'socket.io';

import {
  SPGameClientToServerEvents,
  InterServerEvents,
  SPGameServerToClientEvents,
  SocketData
} from '@schemas/socketIO';
import { SPGameSocketIO } from '@features/singleplayer-game/SPGame.socketio';
import AuthService from '@features/auth/Auth.service';
import { ExtendedError } from 'socket.io/dist/namespace';
import AppError from '@errors/AppError';
import { TokenExpiredError } from 'jsonwebtoken';

const authenticateSocket = (
  socket: Socket,
  next: (err?: ExtendedError) => void
) => {
  const authService = new AuthService();
  const { token } = socket.handshake.auth;
  try {
    const decodedToken = authService.verifyAccessToken(token);
    socket.data.username = decodedToken.username;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      const error = new Error('Token Expired');
      next(error);
    }
    if (error instanceof AppError) {
      next(error);
    }
  }
};

const initSocketServer = (httpServer: Server) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      credentials: true
    }
  });
  const spGameNamespace: Namespace<
    SPGameClientToServerEvents,
    SPGameServerToClientEvents,
    InterServerEvents,
    SocketData
  > = io.of('/sp-game');

  spGameNamespace.use(authenticateSocket);
  spGameNamespace.on('connection', (socket) => {
    const spGameSocketIO = new SPGameSocketIO(socket);
    spGameSocketIO.registerEvents();
  });
};

export default initSocketServer;
