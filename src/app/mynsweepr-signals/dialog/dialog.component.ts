import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  inject
} from '@angular/core';
import { NgClass } from '@angular/common';
import { MynsweeprSignalsDialogService } from '../components';
import { IClasslist } from '../../mynsweepr-model';
import { Utils } from '../../common/utils';

@Component({
  selector: 'app-dialog',
  imports: [NgClass],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
  standalone: true
})
export class MynsweeprSignalsDialogComponent implements OnInit {
    public dialogService: MynsweeprSignalsDialogService;
    public element: ElementRef<HTMLDialogElement>;

    constructor() {
      this.dialogService = inject(MynsweeprSignalsDialogService);
      this.element = inject(ElementRef<HTMLDialogElement>);
    }

  @Input()
  public id = `dialog-${window.crypto.randomUUID()}`;
  @Input()
  public title = 'Dialog';
  @Input()
  public classes: IClasslist = {};
  @Input()
  public autoFocusSelector = '[autofocus]';
  @Output()
  public closed: EventEmitter<string> = new EventEmitter<string>();

  public ngOnInit(): void {
    this.dialogService.register(this.id, this);
  }

  open(): void {
    this.element.nativeElement.showModal();
    this.classes.show = true;
    const autofocusElement = this.element.nativeElement.querySelector<HTMLElement>(this.autoFocusSelector);
    if (Utils.isGoodString(this.autoFocusSelector) &&
        Utils.selectorFocusable(this.element.nativeElement, this.autoFocusSelector) &&
        !Utils.isBad(autofocusElement)) {
          autofocusElement?.focus();
    }
  }

  close(): void {
    this.element.nativeElement.close();
    this.classes.show = false;
    this.closed.emit(this.id);
  }
}
