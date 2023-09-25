import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MynsweeprComponent } from './mynsweepr.component';
import { MineboardService } from './mineboard.service';
import { DifficultySelectorComponent } from './difficulty-selector/difficulty-selector.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { MineboardComponent } from './mineboard/mineboard.component';
import { DialogComponent } from './dialog/dialog.component';
import { BoardPersistenceComponent } from './board-persistence/board-persistence.component';

@NgModule({
  declarations: [
    MynsweeprComponent,
    DifficultySelectorComponent,
    ScoreboardComponent,
    MineboardComponent,
    BoardPersistenceComponent,
    DialogComponent,
  ],
  providers: [MineboardService],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    MynsweeprComponent,
    DifficultySelectorComponent,
    ScoreboardComponent
  ]
})
export class MynsweeprModule {}
