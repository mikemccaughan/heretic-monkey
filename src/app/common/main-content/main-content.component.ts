import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-main-content',
    templateUrl: './main-content.component.html',
    styleUrls: ['./main-content.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true
})
export class MainContentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
