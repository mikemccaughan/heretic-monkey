import { Board } from './Board';

export class SavedBoard {
  public id = `board-${window.crypto.randomUUID()}`;
  public img = `${this.id}.png`;
  public dateSaved = new Date();
  public board: Partial<Board> = {};
}
