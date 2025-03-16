import { Board } from './Board';

export class SavedBoard {
  public id: string = `board-${window.crypto.randomUUID()}`;
  public img: string = `${this.id}.png`;
  public dateSaved: Date = new Date();
  public board: Partial<Board> = {};
}
