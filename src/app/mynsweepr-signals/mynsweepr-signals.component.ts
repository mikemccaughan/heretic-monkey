import { Component, computed, signal } from '@angular/core';
import { MynsweeprSignalsDifficultySelectorComponent } from './difficulty-selector/difficulty-selector.component';
import { MynsweeprSignalsBoardPersistenceComponent } from './board-persistence/board-persistence.component';
import { MynsweeprSignalsScoreboardComponent } from './scoreboard/scoreboard.component';
import { MynsweeprSignalsScorePersistenceComponent } from './score-persistence/score-persistence.component';
import { MynsweeprSignalsMineboardComponent } from './mineboard/mineboard.component';
import { Board, Difficulty } from '../mynsweepr-model';

@Component({
  selector: 'mynsweepr-signals-app',
  imports: [MynsweeprSignalsDifficultySelectorComponent,MynsweeprSignalsBoardPersistenceComponent,MynsweeprSignalsScoreboardComponent,MynsweeprSignalsScorePersistenceComponent,MynsweeprSignalsMineboardComponent],
  templateUrl: './mynsweepr-signals.component.html',
  styleUrl: './mynsweepr-signals.component.css',
  standalone: true
})
export class MynsweeprSignalsComponent {
  public board: Board;

  constructor() {
    this.board = new Board();
  }

  difficultySelected(): void {
    const jdiff = signal(JSON.stringify(this.board.difficulty));
    const pdiff = computed(() => new Difficulty(JSON.parse(jdiff())));
    this.board.difficulty = pdiff();
  }
  saveBoard(): void {

  }
  loadBoardToMineboard(event: Event): void {

  }
  scoresChanged(): void {

  }
  cellClick($event: Event): void {

  }
  cellDoubleClick($event: Event): void {

  }
  cellRightClick($event: Event): void {

  }
  closeDialog(id: string): void {

  }
  rebuildBoard(): void {

  }
}
