import { Injectable } from '@angular/core';
import { Board, Cell, Difficulty, IBoardTraversalOptions, SavedBoard, Scoreboard, wait } from '../mynsweepr-model';
import { Utils } from '../common';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class MynsweeprSignalsMineboardService {
  public board: Board = new Board();
  private preboard: number[][] = [];

  constructor() {
    this.board = new Board();
  }

  //#region board building
  private static createCell(
    x: number,
    y: number,
    value: number,
    index: number,
    hidden?: boolean,
    flag?: boolean
  ): Cell {
    window.performance.mark('mynsweepr.service createCell start');
    hidden = typeof hidden === 'boolean' ? hidden : true;
    flag = typeof flag === 'boolean' ? flag : false;
    const cell = new Cell({
      value,
      x,
      y,
      index,
      isHidden: hidden,
      hasFlag: flag
    });
    window.performance.mark('mynsweepr.service createCell end');
    window.performance.measure(
      'mynsweepr.service createCell',
      'mynsweepr.service createCell start',
      'mynsweepr.service createCell end'
    );
    return cell;
  }
  private sortCells(): void {
    window.performance.mark('mynsweepr.service sortCells start');
    const isNotSorted = this.board.cells.some((c, i) => c.index !== i);
    if (isNotSorted) {
      this.board.cells = this.board.cells.sort(
        (a, b) => (a.index || 0) - (b.index || 0)
      );
    }
    window.performance.mark('mynsweepr.service sortCells end');
    window.performance.measure(
      'mynsweepr.service sortCells',
      'mynsweepr.service sortCells start',
      'mynsweepr.service sortCells end'
    );
  }
  private initPreboard(): void {
    window.performance.mark('mynsweepr.service initPreboard start');
    this.preboard = [];
    for (let y = 0; y < this.board.difficulty.height; y++) {
      this.preboard[y] = [];
      for (let x = 0; x < this.board.difficulty.width; x++) {
        this.preboard[y][x] = 0;
      }
    }
    window.performance.mark('mynsweepr.service initPreboard end');
    window.performance.measure(
      'mynsweepr.service initPreboard',
      'mynsweepr.service initPreboard start',
      'mynsweepr.service initPreboard end'
    );
  }
  private populatePreboard(): void {
    window.performance.mark('mynsweepr.service populatePreboard start');
    const cellCount =
      this.board.difficulty.width * this.board.difficulty.height;
    const mineCount = Math.floor(cellCount / 6);
    const value = -(mineCount * 2);
    const isBetween = (val: number, min: number, max: number): boolean =>
      val >= min && val <= max;
    for (let i = 0; i < mineCount; i++) {
      let x: number;
      let y: number;
      while (true) {
        x = Math.floor(Math.random() * this.board.difficulty.width);
        y = Math.floor(Math.random() * this.board.difficulty.height);
        if (0 <= this.preboard[y][x]) {
          break;
        }
      }
      for (let m = -1; m < 2; m++) {
        for (let n = -1; n < 2; n++) {
          if (n === 0 && m === 0) {
            this.preboard[y][x] = value;
          } else if (
            isBetween(y + n, 0, this.board.difficulty.height - 1) &&
            isBetween(x + m, 0, this.board.difficulty.width - 1)
          ) {
            this.preboard[y + n][x + m]++;
          }
        }
      }
    }
    window.performance.mark('mynsweepr.service populatePreboard end');
    window.performance.measure(
      'mynsweepr.service populatePreboard',
      'mynsweepr.service populatePreboard start',
      'mynsweepr.service populatePreboard end'
    );
  }
  private buildCells(): void {
    window.performance.mark('mynsweepr.service buildCells start');
    this.board.cells = [];
    let cellIndex = 0;
    for (let y = 0; y < this.board.difficulty.height; y++) {
      for (let x = 0; x < this.board.difficulty.width; x++) {
        const cell = MynsweeprSignalsMineboardService.createCell(
          x,
          y,
          this.preboard[y][x],
          cellIndex
        );
        this.board.cells[cellIndex] = cell;
        cellIndex++;
      }
    }
    this.board.populateBoardByCoord();
    window.performance.mark('mynsweepr.service buildCells end');
    window.performance.measure(
      'mynsweepr.service buildCells',
      'mynsweepr.service buildCells start',
      'mynsweepr.service buildCells end'
    );
  }
  buildBoard(
    statusChange: (status: string) => void,
    difficulty?: Difficulty
  ): Board {
    window.performance.mark('mynsweepr.service buildBoard start');
    this.board = new Board();
    this.board.statusChange.subscribe(statusChange);
    this.board.difficulty = new Difficulty(difficulty);
    this.initPreboard();
    this.populatePreboard();
    this.buildCells();
    this.sortCells();
    window.performance.mark('mynsweepr.service buildBoard end');
    window.performance.measure(
      'mynsweepr.service buildBoard',
      'mynsweepr.service buildBoard start',
      'mynsweepr.service buildBoard end'
    );
    return this.board;
  }
  //#endregion board building

  //#region board load/save
  private static _savedBoards: Record<string,SavedBoard> = {};
  public static get savedBoards(): Record<string,SavedBoard> {
    if (Utils.isBad(this._savedBoards)) {
      const jsonBoards = window.localStorage.getItem('hm.mynsweepr.saves');
      if (!Utils.isGoodJson(jsonBoards, false, true)) {
        this._savedBoards = {};
      } else {
        this._savedBoards = JSON.parse(jsonBoards) as Record<string,SavedBoard>;
      }
    }

    return this._savedBoards;
  }
  saveBoard(board: Board): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      window.performance.mark('mynsweepr.service saveBoard start');
      const boardId = `savedBoard${Date.now()}`;
      html2canvas(document.body).then(canvas => {
        const imgPng = canvas.toDataURL();
        // Get only serializable data
        const boardParts: Partial<Board> = {
          cells: [...board.cells],
          cellsByCoords: { ...board.cellsByCoords },
          difficulty: { ...board.difficulty },
          scoreboard: new Scoreboard({
            time: board.scoreboard.time,
            remaining: board.scoreboard.remaining
          })
        };
        const boardToSave: SavedBoard = {
          id: boardId,
          img: imgPng,
          dateSaved: new Date(),
          board: boardParts
        };
        MynsweeprSignalsMineboardService.savedBoards[boardId] = boardToSave;
        window.localStorage.setItem('hm.mynsweepr.saves', JSON.stringify(MynsweeprSignalsMineboardService.savedBoards));
        window.performance.mark('mynsweepr.service saveBoard end');
        window.performance.measure(
          'mynsweepr.service saveBoard',
          'mynsweepr.service saveBoard start',
          'mynsweepr.service saveBoard end'
        );
        resolve(true);
      }).catch((reason) => {
        window.performance.mark('mynsweeper.service saveBoard end');
        window.performance.measure(
          'mynsweepr.service saveBoard',
          'mynsweepr.service saveBoard start',
          'mynsweepr.service saveBoard end'
        );
        reject(reason);
      });
    });
  }
  getSavedBoards(): Record<string,SavedBoard> {
    window.performance.mark('mynsweepr.service getSavedBoards start');
    const savedBoards = MynsweeprSignalsMineboardService.savedBoards;
    window.performance.mark('mynsweepr.service getSavedBoards end');
    window.performance.measure(
      'mynsweepr.service getSavedBoards',
      'mynsweepr.service getSavedBoards start',
      'mynsweepr.service getSavedBoards end'
    );
    return savedBoards;
  }
  loadBoard(
    statusChange: (status: string) => void,
    savedBoard: SavedBoard
  ): Board {
    window.performance.mark('mynsweepr.service loadBoard start');
    this.board = new Board(savedBoard.board);
    this.board.statusChange?.subscribe(statusChange);
    window.performance.mark('mynsweepr.service loadBoard end');
    window.performance.measure(
      'mynsweepr.service loadBoard',
      'mynsweepr.service loadBoard start',
      'mynsweepr.service loadBoard end'
    );
    return this.board;
  }
  //#endregion board load/save

  //#region board traversal
  private traversalOptions: {
    canMoveUp: (cell: Cell) => boolean;
    canMoveDown: (cell: Cell) => boolean;
    canMoveLeft: (cell: Cell) => boolean;
    canMoveRight: (cell: Cell) => boolean;
  } = {
    canMoveUp: (cell: Cell) => Utils.isBad(cell) ? false :
      cell.y !== this.decrementY(cell.y) &&
      (this.isHiddenByCoord(cell.x, this.decrementY(cell.y)) ||
        cell.x === this.incrementX(cell.x)),
    canMoveDown: (cell: Cell) => Utils.isBad(cell) ? false :
      cell.y !== this.incrementY(cell.y) &&
      (this.isHiddenByCoord(cell.x, this.incrementY(cell.y)) ||
        cell.x === this.decrementY(cell.x)),
    canMoveLeft: (cell: Cell) => Utils.isBad(cell) ? false :
      cell.x !== this.decrementX(cell.x) &&
      (this.isHiddenByCoord(this.decrementX(cell.x), cell.y) ||
        cell.y === this.incrementY(cell.y)),
    canMoveRight: (cell: Cell) => Utils.isBad(cell) ? false :
      cell.x !== this.incrementX(cell.x) &&
      (this.isHiddenByCoord(this.incrementX(cell.x), cell.y) ||
        cell.y === this.decrementY(cell.y))
  };

  private decrementX(x: number): number {
    return x === 0 ? 0 : x - 1;
  }
  private decrementY(y: number): number {
    return y === 0 ? 0 : y - 1;
  }
  private incrementX(x: number): number {
    const value = this.board?.difficulty?.width ?? 0;
    return x === value - 1
      ? value - 1
      : x + 1;
  }
  private incrementY(y: number): number {
    const value = this.board?.difficulty?.height ?? 0;
    return y === value - 1
      ? value - 1
      : y + 1;
  }
  private getCellByCoord(x: number, y: number): Cell {
    if (Utils.isBad(this.board)) {
      throw new Error('Board not initialized');
    }
    return this.board.cellsByCoords[Board.getCoord(x, y)] ?? new Cell();
  }
  private isHiddenByCoord(x: number, y: number): boolean {
    const cell = this.getCellByCoord(x, y);
    if (!cell) {
      throw new Error(`No cell at (x, y): (${x}, ${y})`);
    }
    return cell.isHidden;
  }
  private isContiguousWithOriginal(cell: Cell, original: Cell): boolean {
    const result =
      cell.index === original.index ||
      (cell.x === original.x && cell.y === original.y + 1) ||
      (cell.x === original.x + 1 && cell.y === original.y + 1) ||
      (cell.x === original.x - 1 && cell.y === original.y + 1) ||
      (cell.x === original.x && cell.y === original.y - 1) ||
      (cell.x === original.x + 1 && cell.y === original.y - 1) ||
      (cell.x === original.x - 1 && cell.y === original.y - 1) ||
      (cell.y === original.y && cell.x === original.x + 1) ||
      (cell.y === original.y && cell.x === original.x - 1);
    return result;
  }
  //#endregion board traversal

  //#region special case board traversal
  private cellIsInHistory(
    cell: Cell,
    options: IBoardTraversalOptions
  ): boolean {
    return (
      (options.cellHistory || []).findIndex(ce => ce.index === cell.index) ===
      -1
    );
  }

  private getCellsForRevealAround(options: IBoardTraversalOptions): Set<Cell> {
    window.performance.mark('mynsweepr.service getCellsForRevealAround start');
    options.cellHistory = [...(options.cellHistory || []), options.cell];
    options.result = new Set<Cell>([
      ...options.result,
      ...this.board.cells.filter(options.addToResult)
    ]);
    window.performance.mark('mynsweepr.service getCellsForRevealAround end');
    window.performance.measure(
      'mynsweepr.service getCellsForRevealAround',
      'mynsweepr.service getCellsForRevealAround start',
      'mynsweepr.service getCellsForRevealAround end'
    );

    return options.result;
  }

  private getCellsForEpicFail(options: IBoardTraversalOptions): Set<Cell> {
    return new Set<Cell>(this.board.cells.filter(options.addToResult));
  }
  private epicFail(cell: Cell): void {
    if (!cell) {
      throw new Error(`No cell`);
    }

    window.performance.mark('mynsweepr.service epicFail start');
    let cellsToUpdate = new Set<Cell>();
    const options: IBoardTraversalOptions = {
      ...this.traversalOptions,
      addToResult: (cel: Cell) => !!cel && cel.isHidden,
      cell,
      result: cellsToUpdate,
      cellHistory: [cell]
    };
    cellsToUpdate = this.getCellsForEpicFail(options);

    for (const cel of cellsToUpdate) {
      cel.isHidden = false;
      wait(100).then(() => this.board.hadChange = !this.board.hadChange);
    }
    window.performance.mark('mynsweepr.service epicFail end');
    window.performance.measure(
      'mynsweepr.service epicFail',
      'mynsweepr.service epicFail start',
      'mynsweepr.service epicFail end'
    );
  }

  private addForEpicWin(cell: Cell, originalCell: Cell): boolean {
    return (
      cell.isHidden &&
      !cell.hasMine &&
      !cell.hasFlag &&
      this.isContiguousWithOriginal(cell, originalCell)
    );
  }
  private getCellsForEpicWin(options: IBoardTraversalOptions): Set<Cell> {
    window.performance.mark('mynsweepr.service getCellsForEpicWin start');
    options.cellHistory = [...(options.cellHistory || []), options.cell];

    options.result = new Set<Cell>([
      ...options.result,
      ...this.board.cells.filter(options.addToResult)
    ]);
    for (const cell of [...options.result].filter(
      c =>
        c.value === 0 &&
        options.cell.index !== c.index &&
        this.cellIsInHistory(c, options)
    )) {
      options.cell = cell;
      options.addToResult = cel =>
        cel && cel.isHidden && !cel.hasMine && this.addForEpicWin(cel, cell);
      options.result = new Set<Cell>([
        ...options.result,
        ...this.getCellsForEpicWin(options)
      ]);
    }
    window.performance.mark('mynsweepr.service getCellsForEpicWin end');
    window.performance.measure(
      'mynsweepr.service getCellsForEpicWin',
      'mynsweepr.service getCellsForEpicWin start',
      'mynsweepr.service getCellsForEpicWin end'
    );
    return options.result;
  }
  private epicWin(cell: Cell): Cell {
    if (!cell) {
      throw new Error(`No cell`);
    }

    window.performance.mark('mynsweepr.service epicWin start');
    let cellsToUpdate = new Set<Cell>();
    const options: IBoardTraversalOptions = {
      ...this.traversalOptions,
      addToResult: (cel: Cell) =>
        cel && cel.isHidden && !cel.hasMine && this.addForEpicWin(cel, cell),
      cell,
      result: cellsToUpdate,
      cellHistory: [cell]
    };
    cellsToUpdate = this.getCellsForEpicWin(options);

    for (const cel of cellsToUpdate) {
      cel.isHidden = false;
      wait(100).then(() => this.board.hadChange = !this.board.hadChange);
    }
    window.performance.mark('mynsweepr.service epicWin end');
    window.performance.measure(
      'mynsweepr.service epicWin',
      'mynsweepr.service epicWin start',
      'mynsweepr.service epicWin end'
    );
    return cell;
  }
  //#endregion special case board traversal

  //#region cell interaction
  cellReveal(cell: Cell): void {
    if (!cell) {
      throw new Error(`No cell`);
    }
    window.performance.mark('mynsweepr.service cellReveal start');
    if (cell.hasMine) {
      // blow up
      this.epicFail(cell);
    } else if (cell.hasFlag) {
      // hmmm...
    } else if (cell.isHidden) {
      if (cell.nearby === 0) {
        this.epicWin(cell);
      } else {
        cell.isHidden = false;
        wait(100).then(() => this.board.hadChange = !this.board.hadChange);
      }
    }
    this.startTimer();
    window.performance.mark('mynsweepr.service cellReveal end');
    window.performance.measure(
      'mynsweepr.service cellReveal',
      'mynsweepr.service cellReveal start',
      'mynsweepr.service cellReveal end'
    );
  }
  cellFlag(cell: Cell): void {
    if (!cell) {
      throw new Error(`No cell`);
    }
    window.performance.mark('mynsweepr.service cellFlag start');
    cell.hasFlag = !cell.hasFlag;
    cell.isHidden = !cell.hasFlag;
    this.board.hadChange = !this.board.hadChange;
    this.startTimer();
    window.performance.mark('mynsweepr.service cellFlag end');
    window.performance.measure(
      'mynsweepr.service cellFlag',
      'mynsweepr.service cellFlag start',
      'mynsweepr.service cellFlag end'
    );
  }
  cellRevealAround(cell: Cell): void {
    if (!cell) {
      throw new Error('cell not provided');
    }

    window.performance.mark('mynsweepr.service cellRevealAround start');
    let cellsToUpdate = new Set<Cell>();
    const options: IBoardTraversalOptions = {
      ...this.traversalOptions,
      addToResult: (cel: Cell) =>
        cel && this.isContiguousWithOriginal(cel, cell),
      result: cellsToUpdate,
      cell
    };
    cellsToUpdate = this.getCellsForRevealAround(options);
    // check to see if the number of flagged cells adjacent to cell equals the nearby number
    const numberOfFlags = [...cellsToUpdate].reduce(
      (agg, curr) => (agg += curr.hasFlag ? 1 : 0),
      0
    );
    if (numberOfFlags !== cell.nearby) {
      window.performance.mark(
        'mynsweepr.service cellRevealAround end (wrong number)'
      );
      window.performance.measure(
        'mynsweepr.service cellRevealAround',
        'mynsweepr.service cellRevealAround start',
        'mynsweepr.service cellRevealAround end'
      );
      return;
    }

    for (const cel of [...cellsToUpdate].filter(
      c => c.isHidden && !c.hasFlag
    )) {
      this.cellReveal(cel);
    }
    this.startTimer();
    window.performance.mark('mynsweepr.service cellRevealAround end');
    window.performance.measure(
      'mynsweepr.service cellRevealAround',
      'mynsweepr.service cellRevealAround start',
      'mynsweepr.service cellRevealAround end'
    );
  }
  //#endregion cell interaction

  //#region timer
  startTimer(): void {
    this.board.scoreboard.startTimer();
  }
  stopTimer(): void {
    this.board.scoreboard.stopTimer();
  }
  //#endregion timer
}
