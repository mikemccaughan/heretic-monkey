import { Component } from '@angular/core';
import { Difficulty, ScoreList } from './';
import { Board } from './Board';
import { MineboardService } from './mineboard.service';
import { SavedBoard } from './SavedBoard';
import { Cell } from './Cell';
import { DialogService } from './dialog.service';
import { DifficultySelectorComponent } from './difficulty-selector/difficulty-selector.component';
import { BoardPersistenceComponent } from './board-persistence/board-persistence.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { MineboardComponent } from './mineboard/mineboard.component';
import { ScorePersistenceComponent } from "./score-persistence/score-persistence.component";

@Component({
    selector: 'app-mynsweepr',
    templateUrl: './mynsweepr.component.html',
    styleUrls: ['./mynsweepr.component.css'],
    standalone: true,
    imports: [DifficultySelectorComponent, BoardPersistenceComponent, ScoreboardComponent, MineboardComponent, ScorePersistenceComponent]
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

  scoresChanged() {
    console.log('MynsweeprComponent: scoresChanged: scores changed?');
  }

  statusChanged(status: string) {
    this.board.scoresChange.emit();
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

  loadBoardToMineboard(savedBoard: SavedBoard) {
    window.performance.mark('mynsweepr.component loadBoardToMineboard start');
    this.board = this.mineboardSvc.loadBoard(
      this.statusChanged.bind(this),
      savedBoard
    );

    this.board.hadChange = !this.board.hadChange;
    window.performance.mark('mynsweepr.component loadBoardToMineboard end');
    window.performance.measure(
      'mynsweepr.component loadBoardToMineboard',
      'mynsweepr.component loadBoardToMineboard start',
      'mynsweepr.component loadBoardToMineboard end'
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
