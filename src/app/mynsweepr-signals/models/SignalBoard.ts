import { Utils } from '../../common';
import { IClasslist } from '../../mynsweepr-model';
import { SignalDifficulty, SignalScoreboard, SignalCell, SignalScore, SignalScoreList, ITraversable, ISignalBoardTraversalOptions } from '.';
import { computed, signal, Signal, WritableSignal, EventEmitter } from '@angular/core';
import { BaseBuildable, IBuildable } from './IBuildable';
import { BaseTraversable } from './ITraversable';
import { BaseBoardTraversalOptions } from './ISignalBoardTraversalOptions';

export class SignalBoard implements IBuildable, ITraversable {
  private builtBoard: IBuildable = new BaseBuildable(this);
  private traversable: ITraversable = new BaseTraversable();

  public board: SignalBoard = new SignalBoard();
  public preboard: number[][] = []
  public cellsByCoords: Record<string, SignalCell> = {};
  public statusChange: EventEmitter<string> = new EventEmitter<string>();
  public scoresChange: EventEmitter<void> = new EventEmitter<void>();

  private _difficultySignal: WritableSignal<SignalDifficulty> = signal(SignalDifficulty.Default);
  public get difficulty(): SignalDifficulty {
    return this._difficultySignal();
  }
  public set difficulty(value: SignalDifficulty) {
    this._difficultySignal.set(value);
  }
  private _scoreboardSignal: WritableSignal<SignalScoreboard> = signal(new SignalScoreboard());
  public get scoreboard(): SignalScoreboard {
    return this._scoreboardSignal();
  }
  public set scoreboard(value: SignalScoreboard) {
    this._scoreboardSignal.set(value);
  }
  private _statusSignal: Signal<string> = computed(() => {
    window.performance.mark('Board status start');
    let status = 'unknown';
    if (this.isFailure()) {
      status = 'lost';
    } else if (!this.hasHiddenCells() && this.getRemaining() === 0) {
      status = 'won';
    }
    if (status !== this._statusSignal()) {
      this.statusChange?.emit(status);
      this.scoreboard.stopTimer();
      if (status === 'won') {
        this.scores.push(new SignalScore(this.difficulty, this.scoreboard.time));
        this._saveScores();
        this.scoresChange.emit();
      }
    }

    window.performance.mark('Board status end');
    window.performance.measure(
      'Board status',
      'Board status start',
      'Board status end'
    );
    return status;
  });
  public get status(): string {
    return this._statusSignal();
  }
  private _scoresSignal: WritableSignal<SignalScoreList> = signal(this._loadScores());
  public get scores(): SignalScoreList {
    return this._scoresSignal();
  }
  public set scores(value: SignalScoreList) {
    this._scoresSignal.set(value);
    this._saveScores();
    this.scoresChange.emit();
  }
  private _cellsSignal: WritableSignal<SignalCell[]> = signal([]);
  public get cells(): SignalCell[] {
    return this._cellsSignal();
  }
  public set cells(value: SignalCell[]) {
    this._cellsSignal.set(value);
  }
  private _hadChange: WritableSignal<boolean> = signal(false);
  public get hadChange(): boolean {
    return this._hadChange();
  }
  public set hadChange(value: boolean) {
    this._hadChange.set(value);
    this.scoreboard.remaining = this.getRemaining();
    if (value) {
      this.scoresChange.emit();
    }
  }

  private _classesSignal: Signal<IClasslist> = computed(() => ({
    board: true,
    won: this._statusSignal() === 'won',
    lost: this._statusSignal() === 'lost'
  }));
  public get classes(): IClasslist {
    return this._classesSignal();
  }
  private _widthSignal: Signal<number> = computed(() => {
    return this.difficulty.width * 42;
  });
  public get width(): number {
    return this._widthSignal();
  }
  private _heightSignal: Signal<number> = computed(() => {
    return this.difficulty.height * 42;
  });
  public get height(): number {
    return this._heightSignal();
  }
  private _stylesSignal: Signal<Record<string, string>> = computed(() => ({
    width: `${this._widthSignal()}px`
  }));
  get styles(): Record<string, string> {
    return this._stylesSignal();
  }

  private _remainingSignal: Signal<number> = computed(() => {
    const mines = this._cellsSignal().filter(
      cell => (cell.value || 0) < 0 && !cell.hasFlag
    );
    return mines.length;
  });
  getRemaining(): number {
    return this._remainingSignal();
  }
  private _hasHiddenCellsSignal: Signal<boolean> =
    computed(() => this._cellsSignal().some(cell => cell.isHidden));

  public hasHiddenCells(): boolean {
    return this._hasHiddenCellsSignal();
  }
  private _isFailureSignal: Signal<boolean> =
    computed(() => this._cellsSignal().some(cell => cell.hasMine && !cell.isHidden && !cell.hasFlag));

  constructor(board?: Partial<SignalBoard>) {
    window.performance.mark('Board constructor start');
    if (!board) {
      window.performance.mark('Board constructor start (no board)');
      this.difficulty = new SignalDifficulty();
      this.scoreboard = new SignalScoreboard();
      this.cells = [];
      window.performance.mark('Board constructor end (no board)');
      window.performance.measure(
        'Board constructor (no board)',
        'Board constructor start (no board)',
        'Board constructor end (no board)'
      );
    } else {
      window.performance.mark('Board constructor start (board)');
      this.cells = (board.cells ?? []).map(cell => new SignalCell(cell));
      this.populateBoardByCoord();
      this.difficulty = new SignalDifficulty(board.difficulty);
      this.scoreboard = new SignalScoreboard(board.scoreboard);
      this.scoreboard.remaining = this.getRemaining();
      window.performance.mark('Board constructor end (board)');
      window.performance.measure(
        'Board constructor (board)',
        'Board constructor start (board)',
        'Board constructor end (board)'
      );
    }
    this.scores = this._loadScores();
    this.builtBoard = new BaseBuildable(this);
    this.traversable = new BaseTraversable();
    this.scoresChange.emit();
    window.performance.mark('Board constructor end');
    window.performance.measure(
      'Board constructor',
      'Board constructor start',
      'Board constructor end'
    );
  }

  public static getCoord(x: number, y: number): string {
    return `x${`000${x}`.slice(-3)}y${`000${y}`.slice(-3)}`;
  }

  public populateBoardByCoord(): void {
    window.performance.mark('Board populateBoardByCoord start');
    const props = this._cellsSignal().map(
      cel => [SignalBoard.getCoord(cel.x, cel.y), cel] as [string, SignalCell]
    );
    this.cellsByCoords = Object.fromEntries(props);
    window.performance.mark('Board populateBoardByCoord end');
    window.performance.measure(
      'Board populateBoardByCoord',
      'Board populateBoardByCoord start',
      'Board populateBoardByCoord end'
    );
  }

  public isFailure(): boolean {
    return this._isFailureSignal();
  }

  private _loadScores(): SignalScoreList {
    const jsonScores = window.localStorage.getItem('hm.mynsweepr.scores');
    if (Utils.isGoodString(jsonScores)) {
      let rawScores = JSON.parse(jsonScores);
      rawScores = rawScores
        .flat(Infinity)
        .filter((score: SignalScore) => !!score)
        .map((score: SignalScore) => new SignalScore(score['difficulty'], score['score']));
      if (rawScores.length) {
        return new SignalScoreList(...rawScores);
      } else {
        return new SignalScoreList();
      }
    } else {
      return new SignalScoreList();
    }
  }

  private _saveScores(): void {
    const jsonScores = JSON.stringify(this.scores);
    window.localStorage.setItem('hm.mynsweepr.scores', jsonScores);
  }

  // #region IBuildable
  sortCells = (): void => this.builtBoard.sortCells();
  initPreboard = (): void => this.builtBoard.initPreboard();
  populatePreboard = (): void => this.builtBoard.populatePreboard();
  buildCells = (): void => this.builtBoard.buildCells();
  buildBoard = (
    statusChange: (status: string) => void,
    difficulty?: SignalDifficulty
  ): SignalBoard => this.builtBoard.buildBoard(statusChange, difficulty);
  // #endregion IBuildable

  // #region ITraversable

  // #region traversal options
  cellHistory: SignalCell[] = [];
  traversalOptions: ISignalBoardTraversalOptions = new BaseBoardTraversalOptions(this, this.traversable, undefined, this.cellHistory);
  applyTraversalOptions(existingOptions: Partial<ISignalBoardTraversalOptions>): ISignalBoardTraversalOptions {
    return {
      ...existingOptions,
      ...this.traversalOptions
    }
  }
  // #endregion traversal options

  // #region traversal methods
  decrementX = (x: number): number => this.traversable.decrementX(x);
  decrementY = (y: number): number => this.traversable.decrementY(y);
  incrementX = (x: number): number => this.traversable.incrementX(x);
  incrementY = (y: number): number => this.traversable.incrementY(y);
  getCellByCoord = (x: number, y: number): SignalCell | undefined => this.traversable.getCellByCoord(x, y);
  isHiddenByCoord = (x: number, y: number): boolean => this.traversable.isHiddenByCoord(x, y);
  isContiguousWithOriginal = (cell: SignalCell, original: SignalCell): boolean => this.traversable.isContiguousWithOriginal(cell, original);
  // #endregion traversal methods

  // #region specialized traversal methods
  cellIsInHistory = (
    cell: SignalCell,
    options: ISignalBoardTraversalOptions
  ): boolean => this.cellIsInHistory(cell, options);

  getCellsForRevealAround = (options: ISignalBoardTraversalOptions): Set<SignalCell> => this.traversable.getCellsForRevealAround(options);

  getCellsForEpicFail = (options: ISignalBoardTraversalOptions): Set<SignalCell> => this.traversable.getCellsForEpicFail(options);
  epicFail = (cell: SignalCell): void => this.traversable.epicFail(cell);

  addForEpicWin = (cell: SignalCell, originalCell: SignalCell): boolean => this.traversable.addForEpicWin(cell, originalCell);
  getCellsForEpicWin = (options: ISignalBoardTraversalOptions): Set<SignalCell> => this.traversable.getCellsForEpicWin(options);
  epicWin = (cell: SignalCell): SignalCell => this.traversable.epicWin(cell);
  // #endregion specialized traversal methods

  // #endregion ITraversable
}
