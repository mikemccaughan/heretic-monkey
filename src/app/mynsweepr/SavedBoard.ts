import { Board } from './Board';

export class SavedBoard {
  public id: string = `saved-board-${window.crypto.randomUUID()}`;
  public img: string = '';
  public dateSaved: Date = new Date();
  public board: Partial<Board> = {};
}
