import { Injectable } from '@angular/core';
import { SignalBoard, SignalCell, SignalDifficulty, ISignalBoardTraversalOptions, SavedSignalBoard, SignalScoreboard, wait } from './models';
import { Utils } from '../common';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root',
  useClass: MynsweeprSignalsMineboardService
})
export class MynsweeprSignalsMineboardService {
  public board: SignalBoard = new SignalBoard();
  private preboard: number[][] = [];

  constructor() {
    this.board = new SignalBoard();
  }

  //#region board building
  private static createCell(
    x: number,
    y: number,
    value: number,
    index: number,
    hidden?: boolean,
    flag?: boolean
  ): SignalCell {
    window.performance.mark('mynsweepr.service createCell start');
    hidden = typeof hidden === 'boolean' ? hidden : true;
    flag = typeof flag === 'boolean' ? flag : false;
    const cell = new SignalCell({
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
    difficulty?: SignalDifficulty
  ): SignalBoard {
    window.performance.mark('mynsweepr.service buildBoard start');
    this.board = new SignalBoard();
    this.board.statusChange.subscribe(statusChange);
    this.board.difficulty = new SignalDifficulty(difficulty);
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
  private static _savedBoards: Record<string,SavedSignalBoard> = {};
  public static get savedBoards(): Record<string,SavedSignalBoard> {
    if (Utils.isBad(this._savedBoards)) {
      const jsonBoards = window.localStorage.getItem('hm.mynsweepr.saves');
      if (!Utils.isGoodJson(jsonBoards, false, true)) {
        this._savedBoards = {};
      } else {
        this._savedBoards = JSON.parse(jsonBoards) as Record<string,SavedSignalBoard>;
      }
    }

    return this._savedBoards;
  }
  saveBoard(board: SignalBoard): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      window.performance.mark('mynsweepr.service saveBoard start');
      html2canvas(document.body).then(canvas => {
        // Get only serializable data
        const boardParts: Partial<SignalBoard> = {
          cells: [...board.cells],
          cellsByCoords: { ...board.cellsByCoords },
          difficulty: new SignalDifficulty(board.difficulty),
          scoreboard: new SignalScoreboard({
            time: board.scoreboard.time,
            remaining: board.scoreboard.remaining
          })
        };
        const boardToSave: SavedSignalBoard = new SavedSignalBoard(boardParts);
        boardToSave.img = canvas.toDataURL();
        MynsweeprSignalsMineboardService.savedBoards[boardToSave.id] = boardToSave;
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
  getSavedBoards(): Record<string,SavedSignalBoard> {
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
    savedBoard: SavedSignalBoard
  ): SignalBoard {
    window.performance.mark('mynsweepr.service loadBoard start');
    this.board = new SignalBoard(savedBoard.board);
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
    canMoveUp: (cell: SignalCell) => boolean;
    canMoveDown: (cell: SignalCell) => boolean;
    canMoveLeft: (cell: SignalCell) => boolean;
    canMoveRight: (cell: SignalCell) => boolean;
  } = {
    canMoveUp: (cell: SignalCell) => Utils.isBad(cell) ? false :
      cell.y !== this.decrementY(cell.y) &&
      (this.isHiddenByCoord(cell.x, this.decrementY(cell.y)) ||
        cell.x === this.incrementX(cell.x)),
    canMoveDown: (cell: SignalCell) => Utils.isBad(cell) ? false :
      cell.y !== this.incrementY(cell.y) &&
      (this.isHiddenByCoord(cell.x, this.incrementY(cell.y)) ||
        cell.x === this.decrementY(cell.x)),
    canMoveLeft: (cell: SignalCell) => Utils.isBad(cell) ? false :
      cell.x !== this.decrementX(cell.x) &&
      (this.isHiddenByCoord(this.decrementX(cell.x), cell.y) ||
        cell.y === this.incrementY(cell.y)),
    canMoveRight: (cell: SignalCell) => Utils.isBad(cell) ? false :
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
  private getCellByCoord(x: number, y: number): SignalCell {
    if (Utils.isBad(this.board)) {
      throw new Error('Board not initialized');
    }
    return this.board.cellsByCoords[SignalBoard.getCoord(x, y)] ?? new SignalCell();
  }
  private isHiddenByCoord(x: number, y: number): boolean {
    const cell = this.getCellByCoord(x, y);
    if (!cell) {
      throw new Error(`No cell at (x, y): (${x}, ${y})`);
    }
    return cell.isHidden;
  }
  private isContiguousWithOriginal(cell: SignalCell, original: SignalCell): boolean {
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
    cell: SignalCell,
    options: ISignalBoardTraversalOptions
  ): boolean {
    return (
      (options.cellHistory || []).findIndex(ce => ce.index === cell.index) ===
      -1
    );
  }

  private getCellsForRevealAround(options: ISignalBoardTraversalOptions): Set<SignalCell> {
    window.performance.mark('mynsweepr.service getCellsForRevealAround start');
    options.cellHistory = [...(options.cellHistory || []), options.cell];
    options.result = new Set<SignalCell>([
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

  private getCellsForEpicFail(options: ISignalBoardTraversalOptions): Set<SignalCell> {
    return new Set<SignalCell>(this.board.cells.filter(options.addToResult));
  }
  private epicFail(cell: SignalCell): void {
    if (!cell) {
      throw new Error(`No cell`);
    }

    window.performance.mark('mynsweepr.service epicFail start');
    let cellsToUpdate = new Set<SignalCell>();
    const options: ISignalBoardTraversalOptions = {
      ...this.traversalOptions,
      addToResult: (cel: SignalCell) => !!cel && cel.isHidden,
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

  private addForEpicWin(cell: SignalCell, originalCell: SignalCell): boolean {
    return (
      cell.isHidden &&
      !cell.hasMine &&
      !cell.hasFlag &&
      this.isContiguousWithOriginal(cell, originalCell)
    );
  }
  private getCellsForEpicWin(options: ISignalBoardTraversalOptions): Set<SignalCell> {
    window.performance.mark('mynsweepr.service getCellsForEpicWin start');
    options.cellHistory = [...(options.cellHistory || []), options.cell];

    options.result = new Set<SignalCell>([
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
      options.result = new Set<SignalCell>([
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
  private epicWin(cell: SignalCell): SignalCell {
    if (!cell) {
      throw new Error(`No cell`);
    }

    window.performance.mark('mynsweepr.service epicWin start');
    let cellsToUpdate = new Set<SignalCell>();
    const options: ISignalBoardTraversalOptions = {
      ...this.traversalOptions,
      addToResult: (cel: SignalCell) =>
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
  cellReveal(cell: SignalCell): void {
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
  cellFlag(cell: SignalCell): void {
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
  cellRevealAround(cell: SignalCell): void {
    if (!cell) {
      throw new Error('cell not provided');
    }

    window.performance.mark('mynsweepr.service cellRevealAround start');
    let cellsToUpdate = new Set<SignalCell>();
    const options: ISignalBoardTraversalOptions = {
      ...this.traversalOptions,
      addToResult: (cel: SignalCell) =>
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
