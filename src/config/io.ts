import { Server } from 'http';
import { Namespace, Server as SocketIOServer } from 'socket.io';

import {
  SPGameClientToServerEvents,
  InterServerEvents,
  SPGameServerToClientEvents,
  SocketData
} from '@schemas/socketIO';
import { SPGameSocketIO } from '@features/singleplayer-game/SPGame.socketio';

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

  const spGameSocketIO = new SPGameSocketIO(spGameNamespace);
  spGameSocketIO.registerEvents();
};

export default initSocketServer;
