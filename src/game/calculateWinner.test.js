import { describe, it, expect } from "vitest";
import { calculateWinner, isDraw } from "./calculateWinner";

describe("calculateWinner", () => {
  it("detects a row win", () => {
    const squares = ["X", "X", "X", null, null, null, null, null, null];
    expect(calculateWinner(squares)).toEqual({ winner: "X", line: [0, 1, 2] });
  });

  it("detects a column win", () => {
    const squares = ["O", null, null, "O", null, null, "O", null, null];
    expect(calculateWinner(squares)).toEqual({ winner: "O", line: [0, 3, 6] });
  });

  it("detects a diagonal win", () => {
    const squares = ["X", null, null, null, "X", null, null, null, "X"];
    expect(calculateWinner(squares)).toEqual({ winner: "X", line: [0, 4, 8] });
  });

  it("returns null when there is no winner", () => {
    const squares = ["X", "O", "X", "X", "O", "O", "O", "X", "X"];
    expect(calculateWinner(squares)).toBeNull();
  });
});

describe("isDraw", () => {
  it("is true once the board is completely full", () => {
    const squares = ["X", "O", "X", "X", "O", "O", "O", "X", "X"];
    expect(isDraw(squares)).toBe(true);
  });

  it("is false while empty squares remain", () => {
    expect(isDraw(Array(9).fill(null))).toBe(false);
  });
});
