import { Component, Input } from '@angular/core';
import { SignalScoreboard } from '../models';

@Component({
  selector: 'mynsweepr-signals-scoreboard',
  imports: [],
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.css',
  standalone: true
})
export class MynsweeprSignalsScoreboardComponent {
  @Input()
  public scoreboard: SignalScoreboard = new SignalScoreboard();
}
