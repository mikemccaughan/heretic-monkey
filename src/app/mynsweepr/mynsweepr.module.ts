import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MynsweeprComponent } from './mynsweepr.component';
import { MineboardService } from './mineboard.service';
import { DifficultySelectorComponent } from './difficulty-selector/difficulty-selector.component';

@NgModule({
  declarations: [MynsweeprComponent, DifficultySelectorComponent],
  providers: [MineboardService],
  imports: [CommonModule, ReactiveFormsModule]
})
export class MynsweeprModule {}
