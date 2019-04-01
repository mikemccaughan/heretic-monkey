import { Component, OnInit, Input, Output } from '@angular/core';
import { Board } from '../Board';
import { EventEmitter } from '@angular/core';
import { Cell } from '..';
import { DialogService } from '../dialog.service';

@Component({
  selector: 'app-mineboard',
  templateUrl: './mineboard.component.html',
  styleUrls: ['./mineboard.component.css']
})
export class MineboardComponent {
  public rebuildBoardIds: string[] = ['won', 'lost'];

  constructor(public dialogSvc: DialogService) {}

  @Input()
  public board: Board;
  @Output()
  public cellClicked: EventEmitter<Cell> = new EventEmitter<Cell>();
  @Output()
  public cellRightClicked: EventEmitter<Cell> = new EventEmitter<Cell>();
  @Output()
  public cellDoubleClicked: EventEmitter<Cell> = new EventEmitter<Cell>();
  @Output()
  public rebuildBoardRequested: EventEmitter<void> = new EventEmitter<void>();

  closeDialog(id: string) {
    this.dialogSvc.close(id);
    if (this.rebuildBoardIds.includes(id)) {
      this.rebuildBoardRequested.emit();
    }
  }

  cellRightClick(event: MouseEvent, cell: Cell) {
    event.preventDefault();
    this.cellRightClicked.emit(cell);
  }

  cellClick(event: MouseEvent, cell: Cell) {
    event.preventDefault();
    this.cellClicked.emit(cell);
  }

  cellDoubleClick(event: MouseEvent, cell: Cell) {
    event.preventDefault();
    this.cellDoubleClicked.emit(cell);
  }
}
