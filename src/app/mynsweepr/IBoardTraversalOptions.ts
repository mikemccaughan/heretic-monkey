import { Cell, Direction } from '.';

export interface IBoardTraversalOptions {
  cellHistory?: Cell[];
  cell: Cell;
  nextDirection?: Direction;
  canMoveUp: (cell: Cell) => boolean;
  canMoveDown: (cell: Cell) => boolean;
  canMoveLeft: (cell: Cell) => boolean;
  canMoveRight: (cell: Cell) => boolean;
  addToResult: (cell: Cell) => boolean;
  result: Set<Cell>;
}
