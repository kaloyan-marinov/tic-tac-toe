import { TypeCellState } from "./types";

export const PORT: number = 5000;
export const PORT_FOR_TESTING: number = 5001;

export const connectionName: string =
  process.env.NODE_ENV === "test"
    ? "connection-to-db-for-testing"
    : "connection-to-db-for-dev";

export const INITIAL_STATE_FOR_GAME: TypeCellState[][] = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];
