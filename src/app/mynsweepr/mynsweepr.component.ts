import { Component } from '@angular/core';
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
  public savedBoards: SavedBoard[];
  public dialogs: { [key: string]: boolean };

  constructor(
    public mineboardSvc: MineboardService,
    public dialogSvc: DialogService
  ) {
    window.performance.mark('mynsweepr.component construction start');
    this.board = this.mineboardSvc.buildBoard(this.statusChanged.bind(this));
    this.board.hadChange = !this.board.hadChange;
    window.performance.mark('mynsweepr.component construction end');
    window.performance.measure(
      'mynsweepr.component construction',
      'mynsweepr.component construction start',
      'mynsweepr.component construction end'
    );
  }

  statusChanged(status: string) {
    if (status && status.length) {
      this.openDialog(status);
    }
  }

  difficultySelected(difficulty: Difficulty) {
    window.performance.mark('mynsweepr.component difficultySelected start');
    this.board = this.mineboardSvc.buildBoard(
      this.statusChanged.bind(this),
      difficulty
    );
    this.board.hadChange = !this.board.hadChange;
    window.performance.mark('mynsweepr.component difficultySelected end');
    window.performance.measure(
      'mynsweepr.component difficultySelected',
      'mynsweepr.component difficultySelected start',
      'mynsweepr.component difficultySelected end'
    );
  }

  saveBoard() {
    this.mineboardSvc.saveBoard(this.board);
  }

  loadBoardToMineboad(savedBoard: SavedBoard) {
    window.performance.mark('mynsweepr.component loadBoardToMineboad start');
    this.board = this.mineboardSvc.loadBoard(
      this.statusChanged.bind(this),
      savedBoard
    );

    this.board.hadChange = !this.board.hadChange;
    window.performance.mark('mynsweepr.component loadBoardToMineboad end');
    window.performance.measure(
      'mynsweepr.component loadBoardToMineboad',
      'mynsweepr.component loadBoardToMineboad start',
      'mynsweepr.component loadBoardToMineboad end'
    );
  }

  openDialog(id: string) {
    this.dialogSvc.open(id);
  }

  closeDialog(id: string) {
    this.dialogSvc.close(id);
  }

  rebuildBoard(): void {
    window.performance.mark('mynsweepr.component rebuildBoard start');
    this.board = this.mineboardSvc.buildBoard(
      this.statusChanged.bind(this),
      this.board.difficulty
    );
    window.performance.mark('mynsweepr.component rebuildBoard end');
    window.performance.measure(
      'mynsweepr.component rebuildBoard',
      'mynsweepr.component rebuildBoard start',
      'mynsweepr.component rebuildBoard end'
    );
  }

  cellClick(cell: Cell) {
    window.performance.mark('mynsweepr.component cellClick start');
    this.mineboardSvc.cellReveal(cell);
    window.performance.mark('mynsweepr.component cellClick end');
    window.performance.measure(
      'mynsweepr.component cellClick',
      'mynsweepr.component cellClick start',
      'mynsweepr.component cellClick end'
    );
  }

  cellRightClick(cell: Cell) {
    window.performance.mark('mynsweepr.component cellRightClick start');
    this.mineboardSvc.cellFlag(cell);
    window.performance.mark('mynsweepr.component cellRightClick end');
    window.performance.measure(
      'mynsweepr.component cellRightClick',
      'mynsweepr.component cellRightClick start',
      'mynsweepr.component cellRightClick end'
    );
  }

  cellDoubleClick(cell: Cell) {
    this.mineboardSvc.cellRevealAround(cell);
  }
}
