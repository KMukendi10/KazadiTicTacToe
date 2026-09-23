import { describe, it, expect } from "vitest";
import { getRandomMove, getBestMove, getComputerMove } from "./ai";

describe("getRandomMove", () => {
  it("only ever picks an empty square", () => {
    const squares = ["X", null, "O", null, null, "X", null, null, "O"];
    for (let i = 0; i < 20; i++) {
      const move = getRandomMove(squares);
      expect(squares[move]).toBeNull();
    }
  });

  it("returns null when the board is full", () => {
    const squares = Array(9).fill("X");
    expect(getRandomMove(squares)).toBeNull();
  });
});

describe("getBestMove (unbeatable)", () => {
  it("never loses — blocks the opponent's winning move", () => {
    const squares = ["X", "X", null, null, "O", null, null, null, null];
    expect(getBestMove(squares, "O", "X")).toBe(2);
  });

  it("takes a winning move when available", () => {
    const squares = ["O", "O", null, "X", "X", null, null, null, null];
    expect(getBestMove(squares, "O", "X")).toBe(2);
  });
});

describe("getComputerMove", () => {
  it("routes 'unbeatable' to the optimal minimax move", () => {
    const squares = ["O", "O", null, "X", "X", null, null, null, null];
    expect(getComputerMove(squares, "unbeatable", "O", "X")).toBe(2);
  });

  it("routes 'easy' to a random move", () => {
    const squares = Array(9).fill(null);
    const move = getComputerMove(squares, "easy", "O", "X");
    expect(squares[move]).toBeNull();
  });

  it("falls back to a random move for an unrecognized difficulty", () => {
    const squares = Array(9).fill(null);
    const move = getComputerMove(squares, "nonsense", "O", "X");
    expect(squares[move]).toBeNull();
  });
});
