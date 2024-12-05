import { Component, computed, Input, signal } from '@angular/core';
import { Utils } from 'src/app/common';
import { Difficulty, ScoreList } from 'src/app/mynsweepr-model';

@Component({
  selector: 'mynsweepr-signals-score-persistence',
  imports: [],
  templateUrl: './score-persistence.component.html',
  styleUrl: './score-persistence.component.css',
  standalone: true
})
export class MynsweeprSignalsScorePersistenceComponent {
  private _scores: ScoreList;

  public scoreJson = signal(JSON.stringify(ScoreList.Default));
  public scoreList = computed<ScoreList>(() => new ScoreList(...JSON.parse(this.scoreJson())));

  @Input()
  public get scores(): ScoreList {
    return this.scoreList();
  }
  public set scores(value: ScoreList) {
    if (!Utils.haveSameValues(this.scoreList(), value)) {
      this.scoreJson.set(JSON.stringify(value));
    }
  }

  public difficultyJson = signal(JSON.stringify(Difficulty.Default));
  public difficultyParsed = computed<Difficulty>(() => new Difficulty(JSON.parse(this.difficultyJson())));

  @Input()
  public get difficulty(): Difficulty {
    return this.difficultyParsed();
  }
  public set difficulty(value: Difficulty) {
    if (!Utils.haveSameValue(this.difficultyParsed(), value)) {
      this.difficultyJson.set(JSON.stringify(value));
    }
  }

  public get highScore(): ScoreList {
    if (this.scores?.length && this.difficulty?.value) {
      const hs = ScoreList.highScoreForDifficulty(this.scores, this.difficulty);
      return new ScoreList(...[hs]);
    } else {
      console.log('No scores...');
    }
  }

  public get displayScores(): ScoreList {
    if (this.scores?.length && this.difficulty?.value) {
      return ScoreList.forDifficulty(this.scores, this.difficulty, 5);
    } else {
      console.log('No scores...');
    }
  }
}
