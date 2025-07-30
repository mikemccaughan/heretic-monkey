import { Inject, Component, computed, signal } from "@angular/core";
import {
  MynsweeprSignalsDifficultySelectorComponent,
  MynsweeprSignalsBoardPersistenceComponent,
  MynsweeprSignalsScoreboardComponent,
  MynsweeprSignalsScorePersistenceComponent,
  MynsweeprSignalsMineboardComponent,
  MynsweeprSignalsDialogService
} from "./components";
import { MynsweeprSignalsMineboardService } from "./mineboard.service";
import { SignalBoard, SignalDifficulty, SavedSignalBoard, SignalCell } from "./models";

@Component({
  selector: "mynsweepr-signals-app",
  imports: [
    MynsweeprSignalsDifficultySelectorComponent,
    MynsweeprSignalsBoardPersistenceComponent,
    MynsweeprSignalsScoreboardComponent,
    MynsweeprSignalsScorePersistenceComponent,
    MynsweeprSignalsMineboardComponent
  ],
  templateUrl: "./mynsweepr-signals.component.html",
  styleUrl: "./mynsweepr-signals.component.css",
  standalone: true,
})
export class MynsweeprSignalsComponent {
  public board: SignalBoard;

  constructor(
    @Inject(MynsweeprSignalsMineboardService)
    private mineboardSvc: MynsweeprSignalsMineboardService,
    private dialogSvc: MynsweeprSignalsDialogService
  ) {
    window.performance.mark('mynsweepr-signals.component construction start');
    this.board = this.mineboardSvc.buildBoard(this.statusChanged.bind(this));
    this.board.hadChange = !this.board.hadChange;
    window.performance.mark('mynsweepr-signals.component construction end');
    window.performance.measure(
      'mynsweepr-signals.component construction',
      'mynsweepr-signals.component construction start',
      'mynsweepr-signals.component construction end'
    );
  }

  difficultySelected(): void {
    window.performance.mark('mynsweepr-signals.component difficultySelected start');
    const jdiff = signal(JSON.stringify(this.board.difficulty));
    const pdiff = computed(() => new SignalDifficulty(JSON.parse(jdiff())));
    this.board = this.mineboardSvc.buildBoard(
      this.statusChanged.bind(this),
      pdiff()
    );
    this.board.hadChange = !this.board.hadChange;
    window.performance.mark('mynsweepr-signals.component difficultySelected end');
    window.performance.measure(
      'mynsweepr-signals.component difficultySelected',
      'mynsweepr-signals.component difficultySelected start',
      'mynsweepr-signals.component difficultySelected end'
    );
  }

  saveBoard(): void {
    this.mineboardSvc.saveBoard(this.board);
  }

  loadBoardToMineboard(savedBoard: SavedSignalBoard): void {
    window.performance.mark('mynsweepr-signals.component loadBoardToMineboard start');
    this.board = this.mineboardSvc.loadBoard(
      this.statusChanged.bind(this),
      savedBoard
    );

    this.board.hadChange = !this.board.hadChange;
    window.performance.mark('mynsweepr-signals.component loadBoardToMineboard end');
    window.performance.measure(
      'mynsweepr-signals.component loadBoardToMineboard',
      'mynsweepr-signals.component loadBoardToMineboard start',
      'mynsweepr-signals.component loadBoardToMineboard end'
    );
  }

  scoresChanged(): void {
    /* Do nothing */
    console.log('MynsweeprSignalsComponent: scoresChanged: scores changed?');
  }

  cellClick($event: Event): void {
    window.performance.mark('mynsweepr-signals.component cellClick start');
    const cell = $event as unknown as SignalCell;
    this.mineboardSvc.cellReveal(cell);
    window.performance.mark('mynsweepr-signals.component cellClick end');
    window.performance.measure(
      'mynsweepr-signals.component cellClick',
      'mynsweepr-signals.component cellClick start',
      'mynsweepr-signals.component cellClick end'
    );
  }

  cellDoubleClick($event: Event): void {
    const cell = $event as unknown as SignalCell;
    this.mineboardSvc.cellRevealAround(cell);
  }

  cellRightClick($event: Event): void {
    window.performance.mark('mynsweepr-signals.component cellRightClick start');
    const cell = $event as unknown as SignalCell;
    this.mineboardSvc.cellFlag(cell);
    window.performance.mark('mynsweepr-signals.component cellRightClick end');
    window.performance.measure(
      'mynsweepr-signals.component cellRightClick',
      'mynsweepr-signals.component cellRightClick start',
      'mynsweepr-signals.component cellRightClick end'
    );
  }
  openDialog(id: string) {
    this.dialogSvc.open(id);
  }

  closeDialog(id: string) {
    this.dialogSvc.close(id);
  }

  rebuildBoard(): void {
    window.performance.mark('mynsweepr-signals.component rebuildBoard start');
    this.board = this.mineboardSvc.buildBoard(
      this.statusChanged.bind(this),
      this.board.difficulty
    );
    window.performance.mark('mynsweepr-signals.component rebuildBoard end');
    window.performance.measure(
      'mynsweepr-signals.component rebuildBoard',
      'mynsweepr-signals.component rebuildBoard start',
      'mynsweepr-signals.component rebuildBoard end'
    );
  }

  statusChanged(status: string): void {
    this.board.scoresChange.emit();
    if (status && status.length) {
      this.openDialog(status);
    }

  }
}
