import { describe, it, expect, vi } from "vitest";
import { getRandomMove, getMediumMove, getHardMove, getBestMove, getComputerMove } from "./ai";

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

describe("getMediumMove", () => {
  it("takes an immediate winning move over anything else", () => {
    // O has two in a row at 0,1 — taking 2 wins immediately.
    const squares = ["O", "O", null, "X", "X", null, null, null, null];
    expect(getMediumMove(squares, "O", "X")).toBe(2);
  });

  it("blocks the opponent's immediate winning move when it has no win of its own", () => {
    // X threatens to win at 6 (column 0,3,6) — O must block there.
    const squares = ["X", null, null, "X", "O", null, null, null, null];
    expect(getMediumMove(squares, "O", "X")).toBe(6);
  });

  it("plays randomly when no immediate win or block exists", () => {
    const squares = Array(9).fill(null);
    const move = getMediumMove(squares, "O", "X");
    expect(squares[move]).toBeNull();
  });
});

describe("getHardMove", () => {
  it("plays the optimal move most of the time", () => {
    vi.spyOn(Math, "random").mockReturnValue(0); // always below the optimal-chance threshold
    // O can win immediately at 2.
    const squares = ["O", "O", null, "X", "X", null, null, null, null];
    expect(getHardMove(squares, "O", "X")).toBe(2);
    Math.random.mockRestore();
  });

  it("falls back to Medium-level play the rest of the time", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99); // always above the optimal-chance threshold
    const squares = ["X", null, null, "X", "O", null, null, null, null];
    expect(getHardMove(squares, "O", "X")).toBe(6); // the block a Medium AI would make
    Math.random.mockRestore();
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
  it("routes each difficulty to the right strategy", () => {
    const squares = ["O", "O", null, "X", "X", null, null, null, null];
    // Every difficulty should take the immediate win here.
    expect(getComputerMove(squares, "medium", "O", "X")).toBe(2);
    expect(getComputerMove(squares, "unbeatable", "O", "X")).toBe(2);
  });

  it("falls back to a random move for an unrecognized difficulty", () => {
    const squares = Array(9).fill(null);
    const move = getComputerMove(squares, "nonsense", "O", "X");
    expect(squares[move]).toBeNull();
  });
});
