import { ITraversable, SignalBoard, SignalCell } from '.';
import { Direction } from '../../mynsweepr-model';
import { Utils } from '../../common';
import { BaseTraversable } from './ITraversable';

export interface ISignalBoardTraversalOptions {
  traversable?: ITraversable;
  board: SignalBoard;
  cellHistory?: SignalCell[];
  cell: SignalCell;
  nextDirection?: Direction;
  canMoveUp: (cell: SignalCell) => boolean;
  canMoveDown: (cell: SignalCell) => boolean;
  canMoveLeft: (cell: SignalCell) => boolean;
  canMoveRight: (cell: SignalCell) => boolean;
  addToResult: (cell: SignalCell) => boolean;
  result: Set<SignalCell>
}

export class BaseBoardTraversalOptions implements ISignalBoardTraversalOptions {  
  board: SignalBoard;
  traversable: ITraversable;
  cell: SignalCell;
  cellHistory: SignalCell[];
  result: Set<SignalCell>;  

  constructor(
    board: SignalBoard,
    traversable: ITraversable, 
    cell?: SignalCell, 
    cellHistory?: SignalCell[]
  ) {
    this.board = board ?? new SignalBoard();
    this.traversable = traversable ?? new BaseTraversable();
    this.cell = cell ?? new SignalCell();
    this.cellHistory = [...(cellHistory ?? [])];
    this.result = new Set<SignalCell>();
    this.result = new Set<SignalCell>([...(this.result ?? [])].filter(this.addToResult));
  }

  canMoveUp(cell: SignalCell): boolean {
    return Utils.isBad(cell) ? false : 
    cell.y !== this.traversable.decrementY(cell.y) &&
    (this.traversable.isHiddenByCoord(cell.x, this.traversable.decrementY(cell.y)) ||
       cell.x === this.traversable.incrementX(cell.x))
  }

  canMoveDown(cell: SignalCell): boolean {
    return Utils.isBad(cell) ? false :
    cell.y !== this.traversable.incrementY(cell.y) &&
    (this.traversable.isHiddenByCoord(cell.x, this.traversable.incrementY(cell.y)) ||
      cell.x === this.traversable.decrementY(cell.x))
  }

  canMoveLeft(cell: SignalCell): boolean {
    return Utils.isBad(cell) ? false :
    cell.x !== this.traversable.decrementX(cell.x) &&
    (this.traversable.isHiddenByCoord(this.traversable.decrementX(cell.x), cell.y) ||
      cell.y === this.traversable.incrementY(cell.y));
  }

  canMoveRight(cell: SignalCell): boolean {
    return Utils.isBad(cell) ? false :
    cell.x !== this.traversable.incrementX(cell.x) &&
    (this.traversable.isHiddenByCoord(this.traversable.incrementX(cell.x), cell.y) ||
      cell.y === this.traversable.decrementY(cell.y));
  }

  addToResult(cell: SignalCell) {
    this.result = new Set<SignalCell>([...this.result, cell]);
    return true;
  }
}