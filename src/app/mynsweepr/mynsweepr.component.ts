import { Component, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Difficulty } from './';
import { Board } from './Board';
import { MineboardService } from './mineboard.service';
import { SavedBoard } from './SavedBoard';
import { Cell } from './Cell';
import { DialogService } from './dialog.service';

@Component({
  selector: 'app-mynsweepr',
  templateUrl: './mynsweepr.component.html',
  styleUrls: ['./mynsweepr.component.css']
})
export class MynsweeprComponent {
  public board: Board;
  public difficultySelectorForm: FormGroup;
  public savedBoards: SavedBoard[];
  public dialogs: { [key: string]: boolean };

  constructor(
    public mineboardSvc: MineboardService,
    public dialogSvc: DialogService
  ) {
    this.board = this.mineboardSvc.buildBoard(this.statusChanged.bind(this));
    this.board.hadChange = !this.board.hadChange;
  }

  statusChanged(status: string) {
    if (status && status.length) {
      this.openDialog(status);
    }
  }

  difficultySelected(difficulty: Difficulty) {
    this.board = this.mineboardSvc.buildBoard(
      this.statusChanged.bind(this),
      difficulty
    );
    this.board.hadChange = !this.board.hadChange;
  }

  saveBoard() {
    this.mineboardSvc.saveBoard(this.board);
  }

  loadBoardToMineboad(savedBoard: SavedBoard) {
    this.board = this.mineboardSvc.loadBoard(
      this.statusChanged.bind(this),
      savedBoard
    );

    this.board.hadChange = !this.board.hadChange;
  }

  openDialog(id: string) {
    this.dialogSvc.open(id);
  }

  closeDialog(id: string) {
    this.dialogSvc.close(id);
  }

  rebuildBoard(): void {
    this.board = this.mineboardSvc.buildBoard(
      this.statusChanged.bind(this),
      this.board.difficulty
    );
  }

  cellClick(cell: Cell) {
    this.mineboardSvc.cellReveal(cell);
  }

  cellRightClick(cell: Cell) {
    this.mineboardSvc.cellFlag(cell);
  }

  cellDoubleClick(cell: Cell) {
    this.mineboardSvc.cellRevealAround(cell);
  }
}
