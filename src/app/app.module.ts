import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MynsweeprModule } from './mynsweepr/mynsweepr.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ReactiveFormsModule, MynsweeprModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
