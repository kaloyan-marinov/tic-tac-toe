interface ICellState {
  moveIdx: number;
  username: string;
}

export type TypeCellState = ICellState | null;

export type TypeGameState = TypeCellState[][];

export interface IMove {
  x: number;
  y: number;
  username: string;
}
