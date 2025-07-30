import { Direction } from './';
import { SignalCell } from './Cell';

export interface ISignalBoardTraversalOptions {
  cellHistory?: SignalCell[];
  cell: SignalCell;
  nextDirection?: Direction;
  canMoveUp: (cell: SignalCell) => boolean;
  canMoveDown: (cell: SignalCell) => boolean;
  canMoveLeft: (cell: SignalCell) => boolean;
  canMoveRight: (cell: SignalCell) => boolean;
  addToResult: (cell: SignalCell) => boolean;
  result: Set<SignalCell>;
}
