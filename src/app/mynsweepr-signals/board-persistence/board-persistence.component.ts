import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MynsweeprSignalsDialogComponent, MynsweeprSignalsDialogService, MynsweeprSignalsMineboardService } from '../components';
import { SavedSignalBoard } from '../models';

@Component({
  selector: 'app-board-persistence',
  imports: [MynsweeprSignalsDialogComponent],
  templateUrl: './board-persistence.component.html',
  styleUrl: './board-persistence.component.css',
  standalone: true
})
export class MynsweeprSignalsBoardPersistenceComponent {
  public mineboardSvc: MynsweeprSignalsMineboardService;
  public dialogSvc: MynsweeprSignalsDialogService;

  constructor() {
    this.dialogSvc =  inject(MynsweeprSignalsDialogService);
    this.mineboardSvc = inject(MynsweeprSignalsMineboardService);
    this.saveBoardRequested = new EventEmitter<void>();
    this.loadBoardRequested = new EventEmitter<SavedSignalBoard>();
  }

  public savedBoards: SavedSignalBoard[] = [];
  @Output()
  public saveBoardRequested: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  public loadBoardRequested: EventEmitter<SavedSignalBoard> = new EventEmitter<SavedSignalBoard>();

  saveBoard() {
    this.saveBoardRequested.emit();
  }

  loadBoards(): void {
    this.savedBoards = Object.values(this.mineboardSvc.getSavedBoards());
    this.dialogSvc.open('load');
  }

  loadBoard(savedBoard: SavedSignalBoard) {
    this.loadBoardRequested.emit(savedBoard);
    this.dialogSvc.close('load');
  }
}
