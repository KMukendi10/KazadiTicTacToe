# Tic Tac Toe

React TicTacToe built for the "First Day as a JR Frontend Intern" assignment (iHub / Zaio, due Sep 27).

🔗 **Live demo:** [https://kazadi-tic-tac-toe.vercel.app/]

## Stack
- Vite + React 19
- `useReducer` for all game state (no external store)
- Vitest for unit tests

## Rubric coverage

| Rubric item | Where it lives |
|---|---|
| Base game (40) | `src/game/calculateWinner.js`, `src/game/turns.js`, `App.jsx` |
| Manual feature — no AI (15) | Scoreboard, `src/components/Scoreboard.jsx` |
| State management (20) | Single reducer, `src/game/gameReducer.js` (`MAKE_MOVE`, `JUMP_TO_MOVE`, `NEW_GAME`, `RESET_SCORES`, `SET_MODE`, `SET_DIFFICULTY`, `SET_HUMAN_MARK`, `SET_PLAYER_NAME`, `SET_MATCH_TARGET`, `TOGGLE_TIMER`, `TOGGLE_SOUND`, `SET_THEME`) |
| Advanced feature (15) | Move History + Time Travel, `src/components/MoveHistory.jsx` |
| Loom video (10) | see link above |
| Deployment (10) | see link above |

## Core features
- Full 3x3 game with turn alternation, invalid-move prevention, win/draw detection
- **Manual feature:** Scoreboard (X wins / O wins / draws), persists across "New Game", resettable
- **State management:** single `useReducer` in `src/game/gameReducer.js` — actions are `MAKE_MOVE`, `JUMP_TO_MOVE`, `NEW_GAME`, `RESET_SCORES`, plus settings actions below
- **Advanced feature:** Move History + Time Travel — click any past move to jump the board back to that state; a new move from a jumped-back state branches off (discards the old future)

## Extras
- **Play vs Computer** — four difficulty tiers in `src/game/ai.js`: **Easy** (random), **Medium** (takes an immediate win, blocks an immediate loss, otherwise random), **Hard** (mostly-optimal minimax, occasionally slips into Medium-level play), **Unbeatable** (perfect minimax)
- **Turn timer** — optional 10s per move; auto-plays a random move on timeout
- **Alternating starter** — whoever goes first swaps each New Game (`src/game/turns.js`)
- **Undo** — reverts the last move; correctly un-scores the scoreboard if that move had just won or drawn the round
- **Race to N** — optional match mode (3 / 5 / 10 wins) on top of the regular scoreboard, with a match-winner banner
- **Player names** — replace X/O in the status bar and scoreboard
- **Sound effects** — synthesized with Web Audio (`src/game/sound.js`), no asset files, mutable
- **Hand-drawn marks** — X/O are SVGs that draw themselves in with a stroke animation
- **Confetti** — fires on a win
- **Keyboard play** — arrow keys move focus around the board, Enter/Space to place a mark
- **Light/dark theme** — CSS variables in `src/index.css`, toggle in Settings
- **Persistence** — scores and settings (not the in-progress board) survive a refresh via `localStorage` (`src/game/storage.js`)
- **Splash loader** — a brief spinning X/O animation on first load (`src/components/Loader.jsx`)
- **Confirm dialogs** — Start Over always asks first; changing Opponent, Difficulty, or Race-to-N only asks if there's a board or scoreboard in progress to lose (`src/components/ConfirmDialog.jsx`)

## Run locally
```
npm install
npm run dev
```

## Test
```
npm test
```

## Build
```
npm run build
```
