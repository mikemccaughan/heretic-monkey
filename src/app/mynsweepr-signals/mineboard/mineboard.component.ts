import { Component, Input } from '@angular/core';
import { Board } from 'src/app/mynsweepr-model';

@Component({
  selector: 'mynsweepr-signals-mineboard',
  imports: [],
  templateUrl: './mineboard.component.html',
  styleUrl: './mineboard.component.css',
  standalone: true
})
export class MynsweeprSignalsMineboardComponent {
  @Input()
  public board: Board = new Board();

}
