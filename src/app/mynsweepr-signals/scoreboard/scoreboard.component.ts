import { Component, Input } from '@angular/core';
import { Scoreboard } from 'src/app/mynsweepr-model';

@Component({
  selector: 'mynsweepr-signals-scoreboard',
  imports: [],
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.css',
  standalone: true
})
export class MynsweeprSignalsScoreboardComponent {
  @Input()
  public scoreboard: Scoreboard = new Scoreboard();
}
