import { IClasslist } from './IClasslist';

export class Cell {
  public isHidden: boolean = false;
  public hasFlag: boolean = false;
  public index: number = 0;
  public value: number = 0;
  public x: number = -1;
  public y: number = -1;
  public get nearby(): number | null | undefined {
    return this.value >= 0 ? this.value : null;
  }
  public get hasMine(): boolean | null | undefined {
    return this.value < 0;
  }
  public get label(): string {
    return 'a cell in the mine field' +
      (this.hasFlag ?
        ' which is flagged as having a mine' :
        this.isHidden ?
          '' :
          this.hasMine ?
            ' which has a mine!' :
            this.nearby ?
              ' and has ' + (this.nearby === 1 ?
                'one mine' :
                this.nearby + ' mines') + ' nearby!' :
              ' and has no mines nearby.');
  }
  constructor(cell?: Partial<Cell>) {
    if (cell) {
      this.isHidden = typeof cell.isHidden === 'boolean' ? cell.isHidden : true;
      this.hasFlag = typeof cell.hasFlag === 'boolean' ? cell.hasFlag : false;
      this.index = cell.index ?? 0;
      this.value = cell.value ?? 0;
      this.x = cell.x ?? -1;
      this.y = cell.y ?? -1;
    }
  }
  get classes(): IClasslist {
    return {
      cell: true,
      hidden: !!this.isHidden,
      flag: !!this.hasFlag,
      nearby: !!this.nearby && !this.hasFlag,
      [`nearby-${this.nearby}`]: !!this.nearby,
      mine: !!this.hasMine && !this.hasFlag
    };
  }
}
