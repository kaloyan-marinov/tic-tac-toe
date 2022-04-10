import { IMove, TypeCellState, TypeGameState } from "./types";

export const validateCoordinate = (coordinate: number) => {
  if (0 <= coordinate && coordinate <= 2) {
    return true;
  }
  return false;
};

export const computeMoveIdx = (gameState: TypeGameState, move: IMove): number => {
  if (!validateCoordinate(move.x) || !validateCoordinate(move.y)) {
    return -1;
  }

  // Disallow repeating a previous move.
  if (gameState[move.x][move.y] !== null) {
    return -1;
  }

  /*
  // Compute the index of the currently attempted move.
  let countPastMoves = 0;
  for (let arr of gameState) {
    for (let cellState of arr) {
      countPastMoves += cellState !== null ? 1 : 0;
    }
  }

  const moveIdx = countPastMoves === 0 ? 0 : countPastMoves;
  */

  // Enforce that the players should take turns.
  let stateOfLatestPlayedCell: TypeCellState = null;
  for (let arr of gameState) {
    for (let cellState of arr) {
      if (cellState !== null) {
        if (
          stateOfLatestPlayedCell === null ||
          stateOfLatestPlayedCell.moveIdx < cellState.moveIdx
        ) {
          stateOfLatestPlayedCell = cellState;
        }
      }
    }
  }

  if (
    stateOfLatestPlayedCell !== null &&
    stateOfLatestPlayedCell.username === move.username
  ) {
    return -1;
  }

  return stateOfLatestPlayedCell === null ? 0 : stateOfLatestPlayedCell.moveIdx + 1;
};
