import { IClasslist } from './IClasslist';

export class Cell {
  public isHidden?: boolean;
  public hasFlag?: boolean;
  public index?: number;
  public value?: number;
  public x?: number;
  public y?: number;
  public get nearby(): number {
    return this.value >= 0 ? this.value : null;
  }
  public get hasMine(): boolean {
    return this.value < 0;
  }
  constructor(cell?: Partial<Cell>) {
    if (cell) {
      this.isHidden = typeof cell.isHidden === 'boolean' ? cell.isHidden : true;
      this.hasFlag = typeof cell.hasFlag === 'boolean' ? cell.hasFlag : false;
      this.index = cell.index;
      this.value = cell.value;
      this.x = cell.x;
      this.y = cell.y;
    }
  }
  get classes(): IClasslist {
    return {
      cell: true,
      hidden: this.isHidden,
      flag: this.hasFlag,
      nearby: !!this.nearby && !this.hasFlag,
      [`nearby-${this.nearby}`]: !!this.nearby,
      mine: this.hasMine && !this.hasFlag
    };
  }
}
