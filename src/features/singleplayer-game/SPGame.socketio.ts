import AppError from '@errors/AppError';
import AuthService from '@features/auth/Auth.service';
import {
  InterServerEvents,
  SPGameClientToServerEvents,
  SPGameServerToClientEvents,
  SocketData,
  StartGamePayload,
  WordInputPayload,
  startGamePayloadSchema
} from '@schemas/socketIO';
import { Namespace, Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { SPGameService } from './SPGame.service';

export class SPGameSocketIO {
  private _namespace: Namespace<
    SPGameClientToServerEvents,
    SPGameServerToClientEvents,
    InterServerEvents,
    SocketData
  >;
  private _socket!: Socket<
    SPGameClientToServerEvents,
    SPGameServerToClientEvents,
    InterServerEvents,
    SocketData
  >;

  private _spGameService: SPGameService;

  constructor(namespace: Namespace) {
    this._namespace = namespace;
    this._spGameService = new SPGameService();
  }

  private onStartGame(payload: StartGamePayload) {
    try {
      startGamePayloadSchema.parse(payload);
    } catch (error) {
      this._socket.emit('error', {
        message: 'Invalid timelimit, make sure you select a valid timelimit.'
      });
    }
    this._spGameService.startGame(payload.timeLimit, this.send1SecPassedEvent);
    this.sendGameStartedEvent();
  }

  private onWordInput = (payload: WordInputPayload) => {
    this._spGameService.validateWordCorrectness(
      payload.word,
      this.sendCorrectWordEvent
    );
  };

  private onEndGame = async () => {
    const username = this._socket.data.username!;
    await this._spGameService.endGame(username);
    this.sendGameEndedEvent();
  };

  private sendGameStartedEvent = () => {
    this._socket.emit('gameStarted', {
      timeLeft: this._spGameService.timeLeft
    });
  };
  private send1SecPassedEvent = () => {
    if (this._spGameService.timeLeft >= 1) {
      this._socket.emit('timeLeft', { timeLeft: this._spGameService.timeLeft });
    } else {
      this.sendGameEndedEvent();
    }
  };
  private sendCorrectWordEvent = () => {
    const words = this._spGameService.words;
    this._socket.emit('correctWord', {
      newWord: words[words.length - 1],
      currentScore: this._spGameService.currentScore
    });
  };
  private async sendGameEndedEvent() {
    const username = this._socket.data.username!;
    const topScore = await this._spGameService.getPlayerTopScore(username);
    this._socket.emit('gameEnded', {
      score: this._spGameService.currentScore,
      topScore: topScore
    });
    this._socket.disconnect();
  }

  private authenticateSocket = (
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
      if (error instanceof AppError) {
        next(error);
      }
    }
  };

  public registerEvents = (socket: Socket) => {
    this._socket = socket;
    this._socket.emit('initialWords', { words: this._spGameService.words });
    socket.on('startGame', this.onStartGame.bind(this));
    socket.on('wordInput', this.onWordInput.bind(this));
    socket.on('endGame', this.onEndGame.bind(this));
  };
}
