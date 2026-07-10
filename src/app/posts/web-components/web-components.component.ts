import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-web-components',
    templateUrl: './web-components.component.html',
    styleUrls: ['./web-components.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true
})
export class WebComponentsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
