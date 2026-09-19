import { describe, it, expect } from "vitest";
import { gameReducer, createInitialState } from "./gameReducer";

function playMoves(state, indices) {
  return indices.reduce((s, index) => gameReducer(s, { type: "MAKE_MOVE", index }), state);
}

describe("gameReducer", () => {
  it("makes a move and alternates turns starting with X", () => {
    let state = createInitialState();
    state = gameReducer(state, { type: "MAKE_MOVE", index: 0 });
    expect(state.history[state.currentMove].squares[0]).toBe("X");

    state = gameReducer(state, { type: "MAKE_MOVE", index: 1 });
    expect(state.history[state.currentMove].squares[1]).toBe("O");
  });

  it("ignores a move on an already-filled square", () => {
    let state = createInitialState();
    state = gameReducer(state, { type: "MAKE_MOVE", index: 0 });
    const afterFirstMove = state;
    state = gameReducer(state, { type: "MAKE_MOVE", index: 0 });
    expect(state).toBe(afterFirstMove);
  });

  it("ignores further moves once the game is won", () => {
    let state = createInitialState();
    state = playMoves(state, [0, 3, 1, 4, 2]); // X wins the top row
    const afterWin = state;
    state = gameReducer(state, { type: "MAKE_MOVE", index: 5 });
    expect(state).toBe(afterWin);
  });

  it("scores a win exactly once, even across time travel", () => {
    let state = createInitialState();
    state = playMoves(state, [0, 3, 1, 4, 2]); // X wins the top row
    expect(state.scores.X).toBe(1);

    state = gameReducer(state, { type: "JUMP_TO_MOVE", move: 2 });
    state = gameReducer(state, { type: "JUMP_TO_MOVE", move: 5 });
    expect(state.scores.X).toBe(1);
  });

  it("scores a draw exactly once", () => {
    let state = createInitialState();
    // X O X / X O O / O X X — full board, no winner
    state = playMoves(state, [0, 1, 2, 4, 3, 5, 7, 6, 8]);
    expect(state.scores.draws).toBe(1);
    expect(state.scores.X).toBe(0);
    expect(state.scores.O).toBe(0);
  });

  it("branches history when a move is made from a jumped-back state", () => {
    let state = createInitialState();
    state = playMoves(state, [0, 1, 2]);
    state = gameReducer(state, { type: "JUMP_TO_MOVE", move: 1 });
    state = gameReducer(state, { type: "MAKE_MOVE", index: 4 });

    expect(state.history).toHaveLength(3);
    expect(state.history[2].squares[4]).toBe("O");
    expect(state.history[2].squares[2]).toBeNull(); // the old future is gone
  });

  it("keeps the scoreboard when starting a new game", () => {
    let state = createInitialState();
    state = playMoves(state, [0, 3, 1, 4, 2]);
    state = gameReducer(state, { type: "NEW_GAME" });
    expect(state.scores.X).toBe(1);
    expect(state.history).toHaveLength(1);
    expect(state.currentMove).toBe(0);
  });

  it("resets scores without touching the board in progress", () => {
    let state = createInitialState();
    state = playMoves(state, [0, 3, 1, 4, 2]);
    state = gameReducer(state, { type: "RESET_SCORES" });
    expect(state.scores).toEqual({ X: 0, O: 0, draws: 0 });
  });

  it("updates a player's name", () => {
    let state = createInitialState();
    state = gameReducer(state, { type: "SET_PLAYER_NAME", mark: "X", name: "Kazadi" });
    expect(state.playerNames.X).toBe("Kazadi");
    expect(state.playerNames.O).toBe("Player O");
  });

  it("toggles the sound and timer settings", () => {
    let state = createInitialState();
    const initialSound = state.soundOn;
    const initialTimer = state.timerEnabled;

    state = gameReducer(state, { type: "TOGGLE_SOUND" });
    state = gameReducer(state, { type: "TOGGLE_TIMER" });

    expect(state.soundOn).toBe(!initialSound);
    expect(state.timerEnabled).toBe(!initialTimer);
  });

  it("alternates who starts after each new game", () => {
    let state = createInitialState();
    expect(state.startingMark).toBe("X");

    state = gameReducer(state, { type: "NEW_GAME" });
    expect(state.startingMark).toBe("O");

    state = gameReducer(state, { type: "NEW_GAME" });
    expect(state.startingMark).toBe("X");
  });

  it("lets O make the first move once O is the starting mark", () => {
    let state = createInitialState();
    state = gameReducer(state, { type: "NEW_GAME" }); // now O starts
    state = gameReducer(state, { type: "MAKE_MOVE", index: 0 });
    expect(state.history[state.currentMove].squares[0]).toBe("O");
  });

  it("undoes the last move", () => {
    let state = createInitialState();
    state = playMoves(state, [0, 1]);
    state = gameReducer(state, { type: "UNDO" });
    expect(state.history).toHaveLength(2);
    expect(state.currentMove).toBe(1);
    expect(state.history[1].squares[1]).toBeNull();
  });

  it("does nothing when there is nothing to undo", () => {
    const state = createInitialState();
    const result = gameReducer(state, { type: "UNDO" });
    expect(result).toBe(state);
  });

  it("reverses a scored win when the winning move is undone", () => {
    let state = createInitialState();
    state = playMoves(state, [0, 3, 1, 4, 2]); // X wins the top row
    expect(state.scores.X).toBe(1);

    state = gameReducer(state, { type: "UNDO" });
    expect(state.scores.X).toBe(0);
    expect(state.history).toHaveLength(5);
  });

  it("reverses a scored result when branching off after time travel discards it", () => {
    let state = createInitialState();
    state = playMoves(state, [0, 3, 1, 4, 2]); // X wins the top row
    expect(state.scores.X).toBe(1);

    state = gameReducer(state, { type: "JUMP_TO_MOVE", move: 1 });
    state = gameReducer(state, { type: "MAKE_MOVE", index: 4 }); // branch away from the win

    expect(state.scores.X).toBe(0);
  });

  it("defaults to a race-to-10 match and can be changed or turned off", () => {
    let state = createInitialState();
    expect(state.matchTarget).toBe(10);

    state = gameReducer(state, { type: "SET_MATCH_TARGET", target: 3 });
    expect(state.matchTarget).toBe(3);

    state = gameReducer(state, { type: "SET_MATCH_TARGET", target: null });
    expect(state.matchTarget).toBeNull();
  });
});
