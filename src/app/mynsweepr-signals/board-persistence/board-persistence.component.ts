import { Component, EventEmitter, Output } from '@angular/core';
import { MynsweeprSignalsDialogComponent, MynsweeprSignalsDialogService, MynsweeprSignalsMineboardService } from '../components';
import { SavedBoard } from 'src/app/mynsweepr-model';

@Component({
  selector: 'mynsweepr-signals-board-persistence',
  imports: [MynsweeprSignalsDialogComponent],
  templateUrl: './board-persistence.component.html',
  styleUrl: './board-persistence.component.css',
  standalone: true
})
export class MynsweeprSignalsBoardPersistenceComponent {
  constructor(
    public mineboardSvc: MynsweeprSignalsMineboardService,
    public dialogSvc: MynsweeprSignalsDialogService
  ) {
    this.saveBoardRequested = new EventEmitter<void>();
    this.loadBoardRequested = new EventEmitter<SavedBoard>();
  }

  public savedBoards: SavedBoard[] = [];
  @Output()
  public saveBoardRequested: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  public loadBoardRequested: EventEmitter<SavedBoard> = new EventEmitter<SavedBoard>();

  saveBoard() {
    this.saveBoardRequested.emit();
  }

  loadBoards(): void {
    this.savedBoards = Object.values(this.mineboardSvc.getSavedBoards());
    this.dialogSvc.open('load');
  }

  loadBoard(savedBoard: SavedBoard) {
    this.loadBoardRequested.emit(savedBoard);
    this.dialogSvc.close('load');
  }

  ngOnInit() {}
}
