import { Component, Input } from '@angular/core';
import { Scoreboard } from '../Scoreboard';

@Component({
    selector: 'app-scoreboard',
    templateUrl: './scoreboard.component.html',
    styleUrls: ['./scoreboard.component.css'],
    standalone: false
})
export class ScoreboardComponent {
  constructor() {}

  @Input()
  public scoreboard: Scoreboard;
}
