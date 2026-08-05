import { Component, Input, OnInit } from '@angular/core';
import { Scoreboard } from '../../mynsweepr-model';

@Component({
    selector: 'app-scoreboard',
    templateUrl: './scoreboard.component.html',
    styleUrls: ['./scoreboard.component.css'],
    standalone: true
})
export class ScoreboardComponent implements OnInit {
  @Input()
  public scoreboard!: Scoreboard;

  ngOnInit(): void {
    this.scoreboard = this.scoreboard ?? new Scoreboard();
  }
}
