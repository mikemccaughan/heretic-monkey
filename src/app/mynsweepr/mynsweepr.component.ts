import { Component, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Difficulty } from './';
import { Board } from './Board';
import { MineboardService } from './mineboard.service';
import { SavedBoard } from './SavedBoard';
import { Cell } from './Cell';

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
  public rebuildBoardIds: string[] = ['won', 'lost'];

  constructor(private ref: ElementRef, public mineboardSvc: MineboardService) {
    this.board = this.mineboardSvc.buildBoard(this.statusChanged.bind(this));
    this.difficultySelectorForm = new FormGroup({
      value: new FormControl(this.board.difficulty.value),
      width: new FormControl(this.board.difficulty.width),
      height: new FormControl(this.board.difficulty.height)
    });
    const dialogEntries: [string, boolean][] = Array.from(
      ref.nativeElement.querySelectorAll('dialog')
    ).map((el: HTMLDialogElement) => [el.id, false] as [string, boolean]);
    this.dialogs = dialogEntries.reduce(
      (agg, cur) => (agg[cur[0]] = cur[1]),
      {}
    );
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

  loadBoards() {
    this.savedBoards = this.mineboardSvc.getSavedBoards();
    this.openDialog('load');
  }

  loadBoardToMineboad(savedBoard: SavedBoard) {
    this.board = this.mineboardSvc.loadBoard(
      this.statusChanged.bind(this),
      savedBoard
    );

    this.board.hadChange = !this.board.hadChange;
    this.closeDialog('load');
  }

  openDialog(id: string) {
    this.clearDialogs();
    this.dialogs[id] = true;
  }

  closeDialog(id: string) {
    this.clearDialogs();
    this.dialogs[id] = false;
    if (this.rebuildBoardIds.includes(id)) {
      this.board = this.mineboardSvc.buildBoard(
        this.statusChanged.bind(this),
        this.board.difficulty
      );
    }
  }

  clearDialogs() {
    Object.keys(this.dialogs).forEach(key => (this.dialogs[key] = undefined));
  }

  cellClick(event: MouseEvent, cell: Cell) {
    event.preventDefault();
    this.mineboardSvc.cellReveal(cell);
  }

  cellRightClick(event: MouseEvent, cell: Cell) {
    event.preventDefault();
    this.mineboardSvc.cellFlag(cell);
  }

  cellDoubleClick(event: MouseEvent, cell: Cell) {
    event.preventDefault();
    this.mineboardSvc.cellRevealAround(cell);
  }
}
