import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { SavedBoard } from '../../mynsweepr-model';
import { MineboardService } from '../mineboard.service';
import { DialogService } from '../dialog.service';
import { DialogComponent } from '../dialog/dialog.component';
import { Utils } from '../../common';


@Component({
    selector: 'app-board-persistence',
    templateUrl: './board-persistence.component.html',
    styleUrls: ['./board-persistence.component.css'],
    standalone: true,
    imports: [DialogComponent]
})
export class BoardPersistenceComponent implements OnInit {
  public mineboardSvc: MineboardService;
  public dialogSvc: DialogService;  

  constructor() {
    this.dialogSvc = inject(DialogService);
    this.mineboardSvc = inject(MineboardService);
    this.saveBoardRequested = new EventEmitter<void>();
    this.loadBoardRequested = new EventEmitter<SavedBoard>();
  }
  
  public savedBoards: SavedBoard[] = [];
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

  ngOnInit() {
    Utils.noop();
  }
}
