import {
  InterServerEvents,
  SPGameClientToServerEvents,
  SPGameServerToClientEvents,
  SocketData,
  StartGamePayload,
  WordInputPayload,
  startGamePayloadSchema
} from '@schemas/socketIO';
import { Socket } from 'socket.io';
import { SPGameService } from './SPGame.service';

export class SPGameSocketIO {
  private _socket!: Socket<
    SPGameClientToServerEvents,
    SPGameServerToClientEvents,
    InterServerEvents,
    SocketData
  >;

  private _spGameService: SPGameService;

  constructor(socket: Socket) {
    this._socket = socket;
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
  private send1SecPassedEvent = async () => {
    if (this._spGameService.timeLeft >= 1) {
      this._socket.emit('timeLeft', { timeLeft: this._spGameService.timeLeft });
    } else {
      await this._spGameService.endGame(this._socket.data.username!);
      this.sendGameEndedEvent();
    }
  };
  private sendCorrectWordEvent = () => {
    const words = this._spGameService.words;
    this._socket.emit('correctWord', {
      newWord: words[words.length - 1],
      currentScore: this._spGameService.currentScore,
      timeLeft: this._spGameService.timeLeft
    });
  };
  private async sendGameEndedEvent() {
    const username = this._socket.data.username!;
    const topScore = await this._spGameService.getPlayerTopScore(username);
    // Reset the game
    this._spGameService = new SPGameService();
    this._socket.emit('gameEnded', {
      score: this._spGameService.currentScore,
      topScore: topScore,
      newWords: this._spGameService.words
    });
  }

  public registerEvents = async () => {
    const personalTopScore = await this._spGameService.getPlayerTopScore(
      this._socket.data.username!
    );
    this._socket.emit('initialWords', {
      words: this._spGameService.words,
      personalTopScore: personalTopScore
    });
    this._socket.on('startGame', this.onStartGame.bind(this));
    this._socket.on('wordInput', this.onWordInput.bind(this));
    this._socket.on('endGame', this.onEndGame.bind(this));
  };
}
