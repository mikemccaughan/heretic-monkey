import { Utils } from '../../common';
import { SignalDifficulty, SignalScoreboard, SignalCell, IClasslist, SignalScore, SignalScoreList } from './';
import { computed,signal,Signal,WritableSignal,EventEmitter } from '@angular/core';

export class SignalBoard {
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
  public cellsByCoords: { [key: string]: SignalCell } = {};
  public statusChange: EventEmitter<string> = new EventEmitter<string>();
  public scoresChange: EventEmitter<void> = new EventEmitter<void>();
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

  private _classesSignal: Signal<IClasslist> = computed(() => ({
    board: true,
    won: this._statusSignal() === 'won',
    lost: this._statusSignal() === 'lost'
  }));
  public get classes(): IClasslist {
    return this._classesSignal();
  }
  private _widthSignal: Signal<number> = computed(() => {
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
  });
  public get width(): number {
    return this._widthSignal();
  }
  private _stylesSignal: Signal<any> = computed(() => ({
    width: `${this._widthSignal()}px`
  }));
  get styles(): any {
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
}
