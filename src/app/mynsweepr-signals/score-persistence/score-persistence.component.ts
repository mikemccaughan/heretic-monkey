import { Component, computed, Input, signal, Signal, WritableSignal } from '@angular/core';
import { Utils } from 'src/app/common';
import { SignalDifficulty, SignalScoreList } from '../models';

@Component({
  selector: 'mynsweepr-signals-score-persistence',
  imports: [],
  templateUrl: './score-persistence.component.html',
  styleUrl: './score-persistence.component.css',
  standalone: true
})
export class MynsweeprSignalsScorePersistenceComponent {
  private _scores: SignalScoreList = new SignalScoreList();

  public scoreJson: WritableSignal<string> = signal(JSON.stringify(SignalScoreList.Default));
  public scoreList: Signal<SignalScoreList> = computed<SignalScoreList>(() => new SignalScoreList(...JSON.parse(this.scoreJson())));

  @Input()
  public get scores(): SignalScoreList {
    return this.scoreList();
  }
  public set scores(value: SignalScoreList) {
    if (!Utils.haveSameValues(this.scoreList(), value)) {
      this.scoreJson.set(JSON.stringify(value));
    }
  }

  public difficultyJson = signal(JSON.stringify(SignalDifficulty.Default));
  public difficultyParsed = computed<SignalDifficulty>(() => new SignalDifficulty(JSON.parse(this.difficultyJson())));

  @Input()
  public get difficulty(): SignalDifficulty {
    return this.difficultyParsed();
  }
  public set difficulty(value: SignalDifficulty) {
    if (!Utils.haveSameValue(this.difficultyParsed(), value)) {
      this.difficultyJson.set(JSON.stringify(value));
    }
  }

  public get highScore(): SignalScoreList {
    if (this.scores?.length && this.difficulty?.value) {
      const hs = SignalScoreList.highScoreForDifficulty(this.scores, this.difficulty);
      return new SignalScoreList(...[hs]);
    } else {
      console.log('No scores...');
      return new SignalScoreList();
    }
  }

  public get displayScores(): SignalScoreList {
    if (this.scores?.length && this.difficulty?.value) {
      return SignalScoreList.forDifficulty(this.scores, this.difficulty, 5);
    } else {
      console.log('No scores...');
      return new SignalScoreList();
    }
  }
}
