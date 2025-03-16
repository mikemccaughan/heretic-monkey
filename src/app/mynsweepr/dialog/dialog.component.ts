import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef
} from '@angular/core';
import { IClasslist } from '../IClasslist';
import { DialogService } from '../dialog.service';
import { NgClass } from '@angular/common';
import { Utils } from 'src/app/common/utils';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css'],
    standalone: true,
    imports: [NgClass]
})
export class DialogComponent implements OnInit {
  constructor(
    public dialogService: DialogService,
    public element: ElementRef
  ) {}

  @Input('dialog-id')
  public id: string = `dialog-${window.crypto.randomUUID()}`;
  @Input()
  public title: string = `Dialog`;
  @Input()
  public classes: IClasslist = {};
  @Input()
  public autoFocusSelector: string = '[autofocus]';
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
