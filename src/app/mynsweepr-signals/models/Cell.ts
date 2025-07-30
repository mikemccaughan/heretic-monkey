import { computed,signal,Signal,WritableSignal } from '@angular/core';
import { IClasslist } from '../../mynsweepr-model/IClasslist';

export class SignalCell {
  private _isHiddenSignal: WritableSignal<boolean> = signal(true);
  private _hasFlagSignal: WritableSignal<boolean> = signal(false);
  public get isHidden(): boolean {
    return this._isHiddenSignal() ?? true;
  }
  public set isHidden(value: boolean) {
    this._isHiddenSignal.set(value);
  }
  public get hasFlag(): boolean {
    return this._hasFlagSignal() ?? false;
  }
  public set hasFlag(value: boolean) {
    this._hasFlagSignal.set(value);
  }
  public index: number = -1;
  public value: number = -1;
  public x: number = -1;
  public y: number = -1;
  public get nearby(): number {
    return this.value >= 0 ? this.value : 0;
  }
  public get hasMine(): boolean {
    return this.value < 0;
  }
  private _label: Signal<string> = computed(() => {
    return 'a cell in the mine field' +
      (this._hasFlagSignal() ?
        ' which is flagged as having a mine' :
        this._isHiddenSignal() ?
          '' :
          this.hasMine ?
            ' which has a mine!' :
            this.nearby ?
              ' and has ' + (this.nearby === 1 ?
                'one mine' :
                this.nearby + ' mines') + ' nearby!' :
              ' and has no mines nearby.');
  });
  public get label(): string {
    return this._label();
  }
  constructor(cell?: Partial<SignalCell>) {
    if (cell) {
      this.isHidden = typeof cell.isHidden === 'boolean' ? cell.isHidden : true;
      this.hasFlag = typeof cell.hasFlag === 'boolean' ? cell.hasFlag : false;
      this.index = cell.index ?? -1;
      this.value = cell.value ?? -1;
      this.x = cell.x ?? -1;
      this.y = cell.y ?? -1;
    }
  }
  private _classes = computed(() => {
    return {
      cell: true,
      hidden: this._isHiddenSignal(),
      flag: this._hasFlagSignal(),
      nearby: !!this.nearby && !this._hasFlagSignal(),
      [`nearby-${this.nearby}`]: !!this.nearby,
      mine: this.hasMine && !this._hasFlagSignal()
    };
  })
  get classes(): IClasslist {
    return this._classes();
  }
}
