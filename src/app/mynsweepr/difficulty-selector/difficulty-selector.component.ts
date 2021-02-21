import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Difficulty } from '../Difficulty';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-difficulty-selector',
  templateUrl: './difficulty-selector.component.html',
  styleUrls: ['./difficulty-selector.component.css']
})
export class DifficultySelectorComponent {
  constructor() {
    this.difficulty = new Difficulty();
    this.difficultySelectorForm = new FormGroup({
      value: new FormControl(this.difficulty.value),
      width: new FormControl(this.difficulty.width),
      height: new FormControl(this.difficulty.height)
    });
    this.difficultyChanged = new EventEmitter<Difficulty>();
  }
  @Input()
  public difficulty: Difficulty;
  @Output()
  public difficultyChanged: EventEmitter<Difficulty>;

  public difficultySelectorForm: FormGroup;

  difficultySelected() {
    this.difficulty = new Difficulty(this.difficultySelectorForm.value);
    this.difficultyChanged.emit(this.difficulty);
  }
}
