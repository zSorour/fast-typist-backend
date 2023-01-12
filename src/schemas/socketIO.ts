import { z } from 'zod';

// Server Sent Events
export type SPGameServerToClientEvents = {
  error: (payload: ErrorPayload) => void;
  initialWords: (payload: InitialWordsPayload) => void;
  gameStarted: () => void;
  timeLeft: (payload: TimeLeftPayload) => void;
  correctWord: (payload: CorrectWordPayload) => void;
  gameEnded: (payload: GameEndedPayload) => void;
};

// Server Sent Event Payloads
export type ErrorPayload = { message: string };
export type InitialWordsPayload = { words: string[] };
export type TimeLeftPayload = { timeLeft: number };
export type CorrectWordPayload = {
  currentScore: number;
  newWord: string;
};

export type GameEndedPayload = {
  score: number;
  topScore: number;
};

// Client Sent Events
export type SPGameClientToServerEvents = {
  startGame: (payload: StartGamePayload) => void;
  wordInput: (payload: WordInputPayload) => void;
  endGame: () => void;
};

// Client Sent Event Payloads
export const startGamePayloadSchema = z.object({
  timeLimit: z.number().step(2).min(1).max(7)
});
export type StartGamePayload = z.infer<typeof startGamePayloadSchema>;

export type WordInputPayload = { word: string };

// Inter Server Events
export type InterServerEvents = {
  ping: () => void;
};

// Socket Data
export type SocketData = {
  username: string;
};
