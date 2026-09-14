# Tic Tac Toe

React TicTacToe built for the "First Day as a JR Frontend Intern" assignment.

## Stack
- Vite + React 19
- `useReducer` for all game state (no external store)

## Features
- Full 3x3 game with turn alternation, invalid-move prevention, win/draw detection
- **Manual feature:** Scoreboard (X wins / O wins / draws), persists across "New Game", resettable
- **State management:** single `useReducer` in `src/game/gameReducer.js` — actions are `MAKE_MOVE`, `JUMP_TO_MOVE`, `NEW_GAME`, `RESET_SCORES`
- **Advanced feature:** Move History + Time Travel — click any past move to jump the board back to that state; making a new move from a jumped-back state branches off (discards the old future), same as the official React tutorial's time-travel behaviour

## Run locally
```
npm install
npm run dev
```

## Build
```
npm run build
```
