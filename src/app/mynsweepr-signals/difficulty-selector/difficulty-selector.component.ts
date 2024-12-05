import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Utils } from 'src/app/common';
import { Difficulty } from 'src/app/mynsweepr-model';

@Component({
  selector: 'mynsweepr-signals-difficulty-selector',
  imports: [ReactiveFormsModule],
  templateUrl: './difficulty-selector.component.html',
  styleUrl: './difficulty-selector.component.css',
  standalone: true
})
export class MynsweeprSignalsDifficultySelectorComponent {
  private _difficultyJson = signal(JSON.stringify(Difficulty.Default));
  private _difficultyParsed = computed(() => {
    const json = this._difficultyJson();
    if (Utils.isGoodJson(json, false, true)) {
      const parsed = JSON.parse(json);
      return new Difficulty(parsed);
    }
  });

  @Input()
  public get difficulty(): Difficulty {
    return this._difficultyParsed();
  }
  public set difficulty(value: Difficulty) {
    if (!Utils.haveSameValue(this.difficulty, value)) {
      this._difficultyJson.set(JSON.stringify(value));
      this.difficultyChanged.emit(value);
    }
  }
  @Output()
  public difficultyChanged: EventEmitter<Difficulty>;

  public difficultySelectorForm: UntypedFormGroup;

  constructor() {
    this.difficultyChanged = new EventEmitter<Difficulty>();
    this.difficulty = new Difficulty();
    this.difficultySelectorForm = new UntypedFormGroup({
      value: new UntypedFormControl(this.difficulty.value),
      width: new UntypedFormControl(this.difficulty.width),
      height: new UntypedFormControl(this.difficulty.height)
    });
  }

  public difficultySelected(): void {
    this.difficulty = new Difficulty(this.difficultySelectorForm.value);
    this.difficultyChanged.emit(this.difficulty);
  }
}
