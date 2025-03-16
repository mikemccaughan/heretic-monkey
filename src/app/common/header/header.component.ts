import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    standalone: true
})
export class HeaderComponent implements OnInit {

  @Input()
  public title: string = 'Heretic-Monkey.com';

  constructor() { }

  ngOnInit(): void {
  }

}
