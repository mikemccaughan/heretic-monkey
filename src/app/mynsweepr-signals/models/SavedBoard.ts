import { signal,WritableSignal } from '@angular/core';
import { SignalBoard } from './Board';

export class SavedSignalBoard {
  public id: string = `board-${window.crypto.randomUUID()}`;
  public img: string = `${this.id}.png`;
  private _dateSaved: WritableSignal<Date> = signal(new Date());
  public get dateSaved(): Date {
    return this._dateSaved();
  }
  public set dateSaved(value: Date) {
    this._dateSaved.set(value);
  }
  private _board: WritableSignal<Partial<SignalBoard>> = signal({});
  public get board(): Partial<SignalBoard> {
    return new SignalBoard(this._board());
  }
  public set board(value: Partial<SignalBoard>) {
    this._board.set(new SignalBoard(value));
  }
  constructor(board: Partial<SignalBoard>) {
    this.board = board;
  }
}
