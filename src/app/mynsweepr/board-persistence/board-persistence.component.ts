import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SavedBoard } from '../SavedBoard';
import { MineboardService } from '../mineboard.service';
import { DialogService } from '../dialog.service';

@Component({
    selector: 'app-board-persistence',
    templateUrl: './board-persistence.component.html',
    styleUrls: ['./board-persistence.component.css'],
    standalone: false
})
export class BoardPersistenceComponent implements OnInit {
  constructor(
    public mineboardSvc: MineboardService,
    public dialogSvc: DialogService
  ) {
    this.saveBoardRequested = new EventEmitter<void>();
    this.loadBoardRequested = new EventEmitter<SavedBoard>();
  }

  public savedBoards: SavedBoard[];
  @Output()
  public saveBoardRequested: EventEmitter<void>;
  @Output()
  public loadBoardRequested: EventEmitter<SavedBoard>;

  saveBoard() {
    this.saveBoardRequested.emit();
  }

  loadBoards(): void {
    this.savedBoards = this.mineboardSvc.getSavedBoards();
    this.dialogSvc.open('load');
  }

  loadBoard(savedBoard: SavedBoard) {
    this.loadBoardRequested.emit(savedBoard);
    this.dialogSvc.close('load');
  }

  ngOnInit() {}
}
