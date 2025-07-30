import { Component, Inject, Input } from '@angular/core';
import { SignalBoard, SignalCell } from '../models';
import {
  MynsweeprSignalsDialogComponent,
  MynsweeprSignalsDialogService,
  MynsweeprSignalsMineboardService
} from "../components";
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'mynsweepr-signals-mineboard',
  imports: [
    NgClass,
    NgStyle,
    MynsweeprSignalsDialogComponent
  ],
  templateUrl: './mineboard.component.html',
  styleUrl: './mineboard.component.css',
  standalone: true
})
export class MynsweeprSignalsMineboardComponent {
  @Input()
  public board: SignalBoard = new SignalBoard();
  constructor(
    private dialogService: MynsweeprSignalsDialogService,
    @Inject('MynsweeprSignalsMineboardService')
    private mineboardSvc: MynsweeprSignalsMineboardService
  ) {

  }
  closeDialog(id: string) {
    this.dialogService.close(id);
  }
  private _getCellFromEvent($event: Event): SignalCell | undefined {
    const cellButton = $event.target as HTMLButtonElement;
    if (cellButton?.disabled) {
      return;
    }
    const cellIndex = cellButton?.dataset?.index ?? -1 >= 0 ? parseInt(cellButton.dataset.index ?? '-1', 10) : -1;
    if (cellIndex < 0) {
      return;
    }
    const cell = this.board.cells[cellIndex];
    return cell;
  }
  cellClick($event: Event): void {
    window.performance.mark('mynsweepr-signals.component cellClick start');
    const cell = this._getCellFromEvent($event);
    if (!cell) {
      return;
    }
    this.mineboardSvc.cellReveal(cell);
    window.performance.mark('mynsweepr-signals.component cellClick end');
    window.performance.measure(
      'mynsweepr-signals.component cellClick',
      'mynsweepr-signals.component cellClick start',
      'mynsweepr-signals.component cellClick end'
    );
  }

  cellDoubleClick($event: Event): void {
    const cell = this._getCellFromEvent($event);
    if (!cell) {
      return;
    }
    this.mineboardSvc.cellRevealAround(cell);
  }

  cellRightClick($event: Event): void {
    window.performance.mark('mynsweepr-signals.component cellRightClick start');
    const cell = this._getCellFromEvent($event);
    if (!cell) {
      return;
    }
    this.mineboardSvc.cellFlag(cell);
    window.performance.mark('mynsweepr-signals.component cellRightClick end');
    window.performance.measure(
      'mynsweepr-signals.component cellRightClick',
      'mynsweepr-signals.component cellRightClick start',
      'mynsweepr-signals.component cellRightClick end'
    );
  }

}
