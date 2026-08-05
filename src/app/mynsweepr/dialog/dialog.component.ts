import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  inject
} from '@angular/core';
import { IClasslist } from '../../mynsweepr-model';
import { DialogService } from '../dialog.service';
import { NgClass } from '@angular/common';
import { Utils } from '../../common';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css'],
    standalone: true,
    imports: [NgClass]
})
export class DialogComponent implements OnInit {
  public dialogService: DialogService;
  public element: ElementRef;

  constructor() {
    this.dialogService = inject(DialogService);
    this.element = inject(ElementRef);
  }

  @Input()
  public id = `dialog-${window.crypto.randomUUID()}`;
  @Input()
  public title = `Dialog`;
  @Input()
  public classes: IClasslist = {};
  @Input()
  public autoFocusSelector = '[autofocus]';
  @Output()
  public closed: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit() {
    this.dialogService.register(this.id, this);
  }

  open() {
    this.classes.show = true;
    if (Utils.isGoodString(this.autoFocusSelector) &&
        Utils.selectorFocusable(this.element.nativeElement, this.autoFocusSelector)) {
      this.element.nativeElement.querySelector(this.autoFocusSelector).focus();
    }
  }

  close() {
    this.classes.show = false;
    this.closed.emit(this.id);
  }
}
