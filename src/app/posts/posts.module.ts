import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsComponent } from './posts.component';
import { WebComponentsComponent } from './web-components/web-components.component';



@NgModule({
  declarations: [
    PostsComponent,
    WebComponentsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PostsModule { }
