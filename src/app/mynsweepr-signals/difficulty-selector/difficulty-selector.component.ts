import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Utils } from 'src/app/common';
import { SignalDifficulty } from '../models';

@Component({
  selector: 'mynsweepr-signals-difficulty-selector',
  imports: [ReactiveFormsModule],
  templateUrl: './difficulty-selector.component.html',
  styleUrl: './difficulty-selector.component.css',
  standalone: true
})
export class MynsweeprSignalsDifficultySelectorComponent {
  private _difficultyJson = signal(JSON.stringify(SignalDifficulty.Default));
  private _difficultyParsed = computed(() => {
    const json = this._difficultyJson();
    if (Utils.isGoodJson(json, false, true)) {
      const parsed = JSON.parse(json);
      return new SignalDifficulty(parsed);
    }
  });

  @Input()
  public get difficulty(): SignalDifficulty {
    return this._difficultyParsed() ?? SignalDifficulty.Default;
  }
  public set difficulty(value: SignalDifficulty) {
    if (!Utils.haveSameValue(this.difficulty, value)) {
      this._difficultyJson.set(JSON.stringify(value));
      this.difficultyChanged.emit(value);
    }
  }
  @Output()
  public difficultyChanged: EventEmitter<SignalDifficulty>;

  public difficultySelectorForm: UntypedFormGroup;

  constructor() {
    this.difficultyChanged = new EventEmitter<SignalDifficulty>();
    this.difficulty = new SignalDifficulty();
    this.difficultySelectorForm = new UntypedFormGroup({
      value: new UntypedFormControl(this.difficulty.value),
      width: new UntypedFormControl(this.difficulty.width),
      height: new UntypedFormControl(this.difficulty.height)
    });
  }

  public difficultySelected(): void {
    this.difficulty = new SignalDifficulty(this.difficultySelectorForm.value);
    this.difficultyChanged.emit(this.difficulty);
  }
}
