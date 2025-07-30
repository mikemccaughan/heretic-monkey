import { signal,WritableSignal } from '@angular/core';
import { timer } from './';
import { Subscription } from 'rxjs';

export class SignalScoreboard {
  private _timeSignal: WritableSignal<string> = signal('00:00:00');
  private _remainingSignal: WritableSignal<number> = signal(0);
  public get time(): string {
    return this._timeSignal();
  }
  public set time(value: string) {
    this._timeSignal.set(value);
  }
  public get remaining(): number {
    return this._remainingSignal();
  }
  public set remaining(value: number) {
    this._remainingSignal.set(value);
  }
  timerSub?: Subscription;
  constructor(scoreboard?: Partial<SignalScoreboard>) {
    if (!scoreboard) {
      this.time = '00:00:00';
      this.remaining = 0;
    } else {
      this.time = scoreboard.time ?? '00:00:00';
      this.remaining = scoreboard.remaining ?? 0;
    }
  }
  startTimer: () => void = () => {
    if (!this.timerSub) {
      this.timerSub = timer.subscribe(time => {
        this.time = time;
      });
    }
  }
  stopTimer: () => void = () => {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }
  }
}
