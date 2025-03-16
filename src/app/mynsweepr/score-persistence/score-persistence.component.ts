import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ScoreList, Difficulty } from '../';

@Component({
  selector: 'app-score-persistence',
  imports: [],
  templateUrl: './score-persistence.component.html',
  styleUrl: './score-persistence.component.css',
  standalone: true
})
export class ScorePersistenceComponent implements OnInit {
  private _scores: ScoreList = new ScoreList();
  @Input()
  public set scores(value: ScoreList) {
    value = value?.filter((score) => !!score);
    if ((this._scores?.length ?? 0) === (value?.length ?? 0) && (value?.length ?? 0)) {
      this._scores = new ScoreList(...value);
    } else {
      console.log('scores set to nothing');
    }
  }
  public get scores(): ScoreList {
    if (!this._scores) {
      this._scores = new ScoreList();
    }
    return this._scores;
  }

  @Input()
  public difficulty: Difficulty = Difficulty.Easy;

  @Output()
  public scoresChanged: EventEmitter<void> = new EventEmitter<void>();

  public ngOnInit(): void {
    this.scoresChanged.subscribe(() => {
      console.log('ScorePersistenceComponent: scoresChanged subscription callback: scores changed?');
    });
  }

  public get highScore(): ScoreList {
    if (this.scores?.length && this.difficulty?.value) {
      const hs = ScoreList.highScoreForDifficulty(this.scores, this.difficulty);
      return new ScoreList(...[hs]);
    } else {
      console.log('No scores...');
      return new ScoreList();
    }
  }

  public get displayScores(): ScoreList {
    if (this.scores?.length && this.difficulty?.value) {
      return ScoreList.forDifficulty(this.scores.filter((_, idx) => idx < 5), this.difficulty);
    } else {
      console.log('No scores...');
      return new ScoreList();
    }
  }
}
