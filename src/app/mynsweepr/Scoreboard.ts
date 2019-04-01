import { timer } from './Timer';
import { Subscription } from 'rxjs';

export class Scoreboard {
  time?: string;
  remaining?: number;
  timerSub?: Subscription;
  constructor(scoreboard?: Partial<Scoreboard>) {
    if (!scoreboard) {
      this.time = '00:00:00';
      this.remaining = 0;
    } else {
      this.time = scoreboard.time;
      this.remaining = scoreboard.remaining;
    }
  }
  startTimer?: () => void = () => {
    if (!this.timerSub) {
      this.timerSub = timer.subscribe(time => {
        this.time = time;
      });
    }
  }
  stopTimer?: () => void = () => {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }
  }
}
