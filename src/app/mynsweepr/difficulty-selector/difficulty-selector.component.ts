import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Difficulty } from '../Difficulty';
import { UntypedFormGroup, UntypedFormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-difficulty-selector',
    templateUrl: './difficulty-selector.component.html',
    styleUrls: ['./difficulty-selector.component.css'],
    standalone: true,
    imports: [ReactiveFormsModule]
})
export class DifficultySelectorComponent {
  constructor() {
    this.difficulty = new Difficulty();
    this.difficultySelectorForm = new UntypedFormGroup({
      value: new UntypedFormControl(this.difficulty.value),
      width: new UntypedFormControl(this.difficulty.width),
      height: new UntypedFormControl(this.difficulty.height)
    });
  }
  @Input()
  public difficulty: Difficulty;
  @Output()
  public difficultyChanged: EventEmitter<Difficulty> = new EventEmitter<Difficulty>();

  public difficultySelectorForm: UntypedFormGroup;

  difficultySelected() {
    this.difficulty = new Difficulty(this.difficultySelectorForm.value);
    this.difficultyChanged.emit(this.difficulty);
  }
}
