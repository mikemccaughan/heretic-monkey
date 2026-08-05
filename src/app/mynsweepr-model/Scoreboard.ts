import { SignalScore } from '../mynsweepr-signals/models';
import { timer } from './Timer';
import { Subscription } from 'rxjs';

export class Scoreboard {
  time: string;
  remaining: number;
  timerSub?: Subscription;
  constructor(scoreboard?: Partial<Scoreboard>) {
    if (!scoreboard) {
      this.time = SignalScore.DefaultScore;
      this.remaining = 0;
    } else {
      this.time = scoreboard.time ?? SignalScore.DefaultScore;
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
