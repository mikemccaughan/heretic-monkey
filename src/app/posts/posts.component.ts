import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-posts',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.css'],
    imports: [RouterLink],
    standalone: true
})
export class PostsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
