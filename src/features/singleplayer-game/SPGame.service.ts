import SPGame from '@models/SPGame';
import generateRandomWords from 'random-words';

export class SPGameService {
  private _words: string[];
  private _currentScore: number;
  private _timeLimit: number;
  private _timeLeft: number;
  private _timer!: NodeJS.Timeout | null;
  private _startTimestamp!: number;
  private _onSecElapsed!: () => void;
  private _correctWordsCount: number;
  private _spGameModel: SPGame;

  constructor() {
    this._words = generateRandomWords(3);
    this._currentScore = 0;
    this._timeLimit = 0;
    this._timeLeft = 0;
    this._correctWordsCount = 0;
    this._spGameModel = new SPGame();
  }

  public get words() {
    return this._words;
  }
  public get timeLeft() {
    return this._timeLeft;
  }

  public get currentScore() {
    return this._currentScore;
  }

  public startGame(timeLimit: number, onSecElapsed: () => void) {
    this._startTimestamp = Date.now();
    this._timeLimit = timeLimit;
    this._timeLeft = timeLimit;
    this._onSecElapsed = onSecElapsed;
    this.invokeTimer();
  }

  public async endGame(username: string) {
    const endTimestamp = Date.now();
    const timeDifference = endTimestamp - this._startTimestamp;
    const timeDifferenceInSeconds = timeDifference / 1000;
    const wpm = (this._correctWordsCount / timeDifferenceInSeconds) * 60;
    this._spGameModel.createSPGame({
      score: this._currentScore,
      startTimestamp: this._startTimestamp,
      username: username,
      wpm: wpm
    });
  }

  public validateWordCorrectness(word: string, onCorrectWord: () => void) {
    if (word.toLowerCase() === this._words[0].toLowerCase()) {
      this._correctWordsCount += 1;
      this._currentScore += 1;
      this.generateNewWord();
      this.resetTimer();
      onCorrectWord();
    }
  }

  public async getPlayerTopScore(username: string) {
    return (await this._spGameModel.getPlayerTopScore(username)) || 0;
  }

  private invokeTimer() {
    this._timer = setInterval(() => {
      if (this._timeLeft >= 1) {
        this._timeLeft -= 1;
      } else {
        clearInterval(this._timer!);
        this._timer = null;
      }
      this._onSecElapsed();
    }, 1000);
  }

  private generateNewWord() {
    // Remove the first word and add a new word to the end of the array
    this._words.shift();
    this._words.push(generateRandomWords(1)[0]);
  }

  private resetTimer() {
    clearInterval(this._timer!);
    this._timeLeft = this._timeLimit;
    this.invokeTimer();
  }
}
