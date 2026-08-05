import { Injectable } from '@angular/core';
import { ISignalBoardTraversalOptions, SignalBoard, SignalCell, SignalDifficulty, SavedSignalBoard, SignalScoreboard } from './models';
import { wait } from '../mynsweepr-model';
import { Utils } from '../common';
import html2canvas from 'html2canvas';
import { BaseTraversable, ITraversable } from './models/ITraversable';
import { BaseBuildable, IBuildable } from './models/IBuildable';

@Injectable({
  providedIn: 'root',
  useClass: MynsweeprSignalsMineboardService
})
export class MynsweeprSignalsMineboardService {

  board: SignalBoard = new SignalBoard();
  boardBuilder: IBuildable = new BaseBuildable(this.board);
  boardTraverser: ITraversable = new BaseTraversable();
  preboard: number[][] = [];

  //#region board building
  public static createCell(
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
  sortCells = (): void => this.boardBuilder.sortCells();
  initPreboard = (): void => this.boardBuilder.initPreboard();
  populatePreboard = (): void => this.boardBuilder.populatePreboard();
  buildCells = (): void => this.boardBuilder.buildCells();
  buildBoard = (
    statusChange: (status: string) => void,
    difficulty?: SignalDifficulty
  ): SignalBoard => this.boardBuilder.buildBoard(statusChange,difficulty);
  //#endregion board building

  //#region board load/save
  private static _savedBoards: Record<string, SavedSignalBoard> = {};
  public static get savedBoards(): Record<string, SavedSignalBoard> {
    if (Utils.isBad(this._savedBoards)) {
      const jsonBoards = window.localStorage.getItem('hm.mynsweepr.saves');
      if (!Utils.isGoodJson(jsonBoards, false, true)) {
        this._savedBoards = {};
      } else {
        this._savedBoards = JSON.parse(jsonBoards) as Record<string, SavedSignalBoard>;
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
  getSavedBoards(): Record<string, SavedSignalBoard> {
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

  //#region cell interaction
  cellReveal(cell: SignalCell): void {
    if (!cell) {
      throw new Error(`No cell`);
    }
    window.performance.mark('mynsweepr.service cellReveal start');
    if (cell.hasMine) {
      // blow up
      this.boardTraverser.epicFail(cell);
    } else if (cell.hasFlag) {
      // hmmm...
    } else if (cell.isHidden) {
      if (cell.nearby === 0) {
        this.boardTraverser.epicWin(cell);
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
      ...this.boardTraverser.traversalOptions,
      addToResult: (cel: SignalCell) =>
        cel && this.boardTraverser.isContiguousWithOriginal(cel, cell),
      result: cellsToUpdate,
      cell
    };
    cellsToUpdate = this.boardTraverser.getCellsForRevealAround(options);
    // check to see if the number of flagged cells adjacent to cell equals the nearby number
    const numberOfFlags = [...cellsToUpdate].reduce(
      (agg, curr) => {
        agg += curr.hasFlag ? 1 : 0
        return agg;
      },
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
