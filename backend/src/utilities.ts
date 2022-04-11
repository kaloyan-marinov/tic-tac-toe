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
  const stateOfLatestPlayedCell: TypeCellState = findStateOfLastPlayedCell(gameState);

  if (
    stateOfLatestPlayedCell !== null &&
    stateOfLatestPlayedCell.username === move.username
  ) {
    return -1;
  }

  return stateOfLatestPlayedCell === null ? 0 : stateOfLatestPlayedCell.moveIdx + 1;
};

export const findStateOfLastPlayedCell = (gameState: TypeGameState): TypeCellState => {
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

  return stateOfLatestPlayedCell;
};

export const checkForWinner = (gameState: TypeGameState): string | null => {
  const stateOfLatestPlayedCell: TypeCellState = findStateOfLastPlayedCell(gameState);

  if (stateOfLatestPlayedCell !== null) {
    const { username } = stateOfLatestPlayedCell;

    for (let idx of [0, 1, 2]) {
      // Check the `idx`-th row.
      if (
        gameState[idx][0]?.username === username &&
        gameState[idx][1]?.username === username &&
        gameState[idx][2]?.username === username
      ) {
        return username;
      }

      // Check the `idx`-th column.
      if (
        gameState[0][idx]?.username === username &&
        gameState[1][idx]?.username === username &&
        gameState[2][idx]?.username === username
      ) {
        return username;
      }
    }

    // Check the main diagonal.
    if (
      gameState[0][0]?.username === username &&
      gameState[1][1]?.username === username &&
      gameState[2][2]?.username === username
    ) {
      return username;
    }

    // Check the "other" diagonal.
    if (
      gameState[2][0]?.username === username &&
      gameState[1][1]?.username === username &&
      gameState[0][2]?.username === username
    ) {
      return username;
    }
  }

  return null;
};
