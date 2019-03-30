import { Component, OnInit, Input, Output } from '@angular/core';
import { Difficulty } from '../Difficulty';
import { FormGroup, FormControl } from '@angular/forms';
import { EventEmitter } from '@angular/core';

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
    this.saveBoardRequested = new EventEmitter<void>();
    this.loadBoardsRequested = new EventEmitter<void>();
  }
  @Input()
  public difficulty: Difficulty;
  @Output()
  public difficultyChanged: EventEmitter<Difficulty>;
  @Output()
  public saveBoardRequested: EventEmitter<void>;
  @Output()
  public loadBoardsRequested: EventEmitter<void>;

  public difficultySelectorForm: FormGroup;

  saveBoard() {
    this.saveBoardRequested.emit();
  }

  loadBoards() {
    this.loadBoardsRequested.emit();
  }

  difficultySelected() {
    this.difficulty = new Difficulty(this.difficultySelectorForm.value);
    this.difficultyChanged.emit(this.difficulty);
  }
}
