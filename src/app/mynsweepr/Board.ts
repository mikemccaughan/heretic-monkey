import { Difficulty, Scoreboard, Cell, IClasslist } from './';
import { EventEmitter } from '@angular/core';

export class Board {
  public difficulty: Difficulty;
  public scoreboard: Scoreboard;
  public cells: Cell[];
  public cellsByCoords?: { [key: string]: Cell };
  public statusChange?: EventEmitter<string>;
  private _status: string = null;
  private _hadChange: boolean;
  public get hadChange(): boolean {
    return this._hadChange;
  }
  public set hadChange(value: boolean) {
    this._hadChange = value;
    this.scoreboard.remaining = this.getRemaining();
  }

  constructor(board?: Partial<Board>) {
    if (!board) {
      window.performance.mark('Board constructor start (no board)');
      this.difficulty = new Difficulty();
      this.scoreboard = new Scoreboard();
      this.cells = [];
      window.performance.mark('Board constructor end (no board)');
      window.performance.measure(
        'Board constructor (no board)',
        'Board constructor start (no board)',
        'Board constructor end (no board)'
      );
    } else {
      window.performance.mark('Board constructor start (board)');
      this.cells = board.cells.map(cell => new Cell(cell));
      this.populateBoardByCoord();
      this.difficulty = new Difficulty(board.difficulty);
      this.scoreboard = new Scoreboard(board.scoreboard);
      this.scoreboard.remaining = this.getRemaining();
      window.performance.mark('Board constructor end (board)');
      window.performance.measure(
        'Board constructor (board)',
        'Board constructor start (board)',
        'Board constructor end (board)'
      );
    }
    this.statusChange = new EventEmitter<string>();
  }

  public static getCoord(x: number, y: number): string {
    return `x${`000${x}`.slice(-3)}y${`000${y}`.slice(-3)}`;
  }

  public populateBoardByCoord(): void {
    window.performance.mark('Board populateBoardByCoord start');
    const props = this.cells.map(
      cel => [Board.getCoord(cel.x, cel.y), cel] as [string, Cell]
    );
    this.cellsByCoords = {};
    for (const prop of props) {
      this.cellsByCoords[prop[0]] = prop[1];
    }
    window.performance.mark('Board populateBoardByCoord end');
    window.performance.measure(
      'Board populateBoardByCoord',
      'Board populateBoardByCoord start',
      'Board populateBoardByCoord end'
    );
  }

  get status(): string {
    window.performance.mark('Board status start');
    let status = this._status;
    if (this.isFailure()) {
      status = 'lost';
    } else if (!this.hasHiddenCells() && this.getRemaining() === 0) {
      status = 'won';
    }
    if (status !== this._status) {
      this.statusChange.emit(status);
      this.scoreboard.stopTimer();
      this._status = status;
    }

    window.performance.mark('Board status end');
    window.performance.measure(
      'Board status',
      'Board status start',
      'Board status end'
    );
    return status;
  }
  set status(value: string) {
    this._status = value;
  }
  get classes(): IClasslist {
    return {
      board: true,
      won: this.status === 'won',
      lost: this.status === 'lost'
    };
  }
  get width(): number {
    const difficult = parseInt(this.difficulty.value, 10);
    switch (difficult) {
      case 16:
        return 16 * 42;
      case 30:
        return 30 * 42;
      case -1:
        return this.difficulty.width * 42;
      case 9:
      default:
        return 9 * 42;
    }
  }
  get styles(): any {
    return {
      width: this.width + 'px'
    };
  }

  getRemaining(): number {
    const mines = this.cells.filter(
      cell => (cell.value || 0) < 0 && !cell.hasFlag
    );
    return mines.length;
  }
  hasHiddenCells(): boolean {
    return this.cells.some(cell => cell.isHidden);
  }
  isFailure(): boolean {
    return this.cells.some(
      cell => cell.hasMine && !cell.isHidden && !cell.hasFlag
    );
  }
}
