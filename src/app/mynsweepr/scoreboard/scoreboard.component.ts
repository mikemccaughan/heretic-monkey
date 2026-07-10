import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Scoreboard } from '../Scoreboard';

@Component({
    selector: 'app-scoreboard',
    templateUrl: './scoreboard.component.html',
    styleUrls: ['./scoreboard.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true
})
export class ScoreboardComponent {
  constructor() {}

  @Input()
  public scoreboard: Scoreboard = new Scoreboard();
}
