import { Component, OnInit, Input, Output } from '@angular/core';
import { Board } from '../Board';
import { EventEmitter } from '@angular/core';
import { Cell } from '..';
import { DialogService } from '../dialog.service';

@Component({
    selector: 'app-mineboard',
    templateUrl: './mineboard.component.html',
    styleUrls: ['./mineboard.component.css'],
    standalone: false
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
    window.performance.mark('mineboard.component cellRightClick start');
    event.preventDefault();
    this.cellRightClicked.emit(cell);
    window.performance.mark('mineboard.component cellRightClick end');
    window.performance.measure(
      'mineboard.component cellRightClick',
      'mineboard.component cellRightClick start',
      'mineboard.component cellRightClick end'
    );
  }

  cellClick(event: MouseEvent, cell: Cell) {
    window.performance.mark('mineboard.component cellClick start');
    event.preventDefault();
    this.cellClicked.emit(cell);
    window.performance.mark('mineboard.component cellClick end');
    window.performance.measure(
      'mineboard.component cellClick',
      'mineboard.component cellClick start',
      'mineboard.component cellClick end'
    );
  }

  cellDoubleClick(event: MouseEvent, cell: Cell) {
    window.performance.mark('mineboard.component cellDoubleClick start');
    event.preventDefault();
    this.cellDoubleClicked.emit(cell);
    window.performance.mark('mineboard.component cellDoubleClick end');
    window.performance.measure(
      'mineboard.component cellDoubleClick',
      'mineboard.component cellDoubleClick start',
      'mineboard.component cellDoubleClick end'
    );
  }
}
