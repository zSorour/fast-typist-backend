import { z } from 'zod';

// Server Sent Events
export type SPGameServerToClientEvents = {
  error: (payload: ErrorPayload) => void;
  initialWords: (payload: InitialWordsPayload) => void;
  gameStarted: (payload: GameStartedPayload) => void;
  timeLeft: (payload: TimeLeftPayload) => void;
  correctWord: (payload: CorrectWordPayload) => void;
  gameEnded: (payload: GameEndedPayload) => void;
};

// Server Sent Event Payloads
export type ErrorPayload = { message: string };
export type InitialWordsPayload = { words: string[]; personalTopScore: number };
export type GameStartedPayload = { timeLeft: number };
export type TimeLeftPayload = { timeLeft: number };
export type CorrectWordPayload = {
  currentScore: number;
  newWord: string;
  timeLeft: number;
};

export type GameEndedPayload = {
  score: number;
  topScore: number;
  newWords: string[];
};

// Client Sent Events
export type SPGameClientToServerEvents = {
  startGame: (payload: StartGamePayload) => void;
  wordInput: (payload: WordInputPayload) => void;
  endGame: () => void;
};

// Client Sent Event Payloads
export const startGamePayloadSchema = z.object({
  timeLimit: z
    .number()
    .refine((val) => (val >= 1 && val <= 5) || val === 7 || val === 10)
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
