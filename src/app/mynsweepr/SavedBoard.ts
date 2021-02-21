import { Board } from './Board';
import { Cell } from './Cell';
import { Difficulty } from './Difficulty';
import { Scoreboard } from './Scoreboard';

export class SavedBoard {
  public id: string;
  public img: string;
  public board: {
    cells?: Cell[];
    cellsByCoord?: { [key: string]: Cell };
    difficulty?: Partial<Difficulty>;
    scoreboard?: Partial<Scoreboard>;
  };
}
