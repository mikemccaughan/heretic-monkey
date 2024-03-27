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

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  constructor(
    public dialogService: DialogService,
    public element: ElementRef
  ) {}

  @Input()
  public id: string;
  @Input()
  public title: string;
  @Input()
  public classes: IClasslist;
  @Input()
  public autoFocusSelector: string;
  @Output()
  public closed: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit() {
    this.dialogService.register(this.id, this);
  }

  open() {
    this.classes.show = true;
    if (typeof this.autoFocusSelector === 'string' && this.autoFocusSelector.length > 0 && this.element.nativeElement.querySelector(this.autoFocusSelector) !== null) {
      this.element.nativeElement.querySelector(this.autoFocusSelector).focus();
    }
  }

  close() {
    this.classes.show = false;
    this.closed.emit(this.id);
  }
}
