# Fast Typist Backend

This project exposes a REST API and a WebSocket Server to be used by the [Fast Typist Client](https://github.com/zSorour/fast-typist)

Project is still under development, stay tuned! :clock1:

## Features:

#### :white_check_mark: Single Player Game Mode

The backend server is responsible for handling all the game logic by exposing a SocketIO namespace called "sp-game". Although it is a singleplayer game mode, the game logic should never exist on the client-side since it can be exploited and altered easily.

The following diagram illustrates a sample flow of events:
![alt text](https://am3pap007files.storage.live.com/y4mKx12OjjODQQnLDh9I6DwJiduWu1Tl6Nqf9Cf1ZKvKI4jEDTsy-xG-Y0axG-tDlPJ80-mSq3pI46bl43dPky0ZnXBRI_zqq8XcY9dB6XvFJa8w0MzhFfm-Du-o3Rs6Jn8AUSLt9AZW0QxbiNkoThjPZ6a9Bo0CabmVXeZ3TiShng4mb-mMfyIbGQ4p2_ayw13?width=5147&height=4647&cropmode=none 'Logo Title Text 1')

#### :watch: [Next Release] Multiplayer Game Mode

The backend server would be responsible for handling user requests to create rooms, join rooms, and start multiplayer games together were a set of players are given the same set of words and they compete together to get the most words in a given amount of time, or never miss a word!

#### :watch: [Planned Feature] Scoreboard

Players should be able to view a scoreboard of top scores in different time limits, search for a player's top score, sort by score, etc.

## Technologies used:

- TypeScript and NodeJS Express
- SocketIO: to create a WebSockets server for realtime bi-directional handling of events between the backend and the client for score updates, timers, word checking, etc.
- PostgreSQL running inside a Docker Container to persist
- Prisma a typesafe object relational mapper that is highly compatible with TypeScript and PostgreSQL.
- ZOD: to validate requests and infer types
- Redis: to cache refresh tokens and efficiently refresh users' access tokens without having to sign in.
