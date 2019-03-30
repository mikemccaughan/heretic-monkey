import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MynsweeprModule } from './mynsweepr/mynsweepr.module';
import { MynsweeprComponent } from './mynsweepr/mynsweepr.component';
import { DifficultySelectorComponent } from './mynsweepr/difficulty-selector/difficulty-selector.component';

@NgModule({
  declarations: [AppComponent, MynsweeprComponent, DifficultySelectorComponent],
  imports: [BrowserModule, ReactiveFormsModule, MynsweeprModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
