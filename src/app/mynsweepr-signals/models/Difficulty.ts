import { signal,WritableSignal } from '@angular/core';
import { Utils } from '../../common/utils';
export class SignalDifficulty {
  private _value: WritableSignal<string> = signal('9');
  private _width: WritableSignal<number> = signal(9);
  private _height: WritableSignal<number> = signal(9);
  public get value(): string {
    return this._value();
  }
  public set value(value: string) {
    this._value.set(value);
  }
  public get width(): number {
    return this._width();
  }
  public set width(value: number) {
    this._width.set(value);
  }
  public get height(): number {
    return this._height();
  }
  public set height(value: number) {
    this._height.set(value);
  }
  public static Easy: SignalDifficulty = new SignalDifficulty('9');
  public static Medium: SignalDifficulty = new SignalDifficulty('16');
  public static Hard: SignalDifficulty = new SignalDifficulty('30');
  public static Default: SignalDifficulty = SignalDifficulty.Easy;
  constructor(
    valueOrPartial?: string | Partial<SignalDifficulty>,
    width?: number,
    height?: number
  ) {
    if (!Utils.isBad(valueOrPartial) && valueOrPartial.hasOwnProperty('value')) {
      valueOrPartial = valueOrPartial as Partial<SignalDifficulty>;
      const pValue = valueOrPartial.value ?? '-1';
      const pWidth = pValue === '-1' ?
        valueOrPartial.width :
        parseInt(pValue, 10);
      const pHeight = pValue === '-1' ?
        valueOrPartial.height :
        pValue === '30' ?
        16 :
        parseInt(pValue, 10);
      this.value = Utils.isGoodString(pValue) ? pValue : '9';
      this.width = Utils.isGoodNumber(pWidth) ? pWidth : 9;
      this.height = Utils.isGoodNumber(pHeight) ? pHeight : 9;
    } else {
      valueOrPartial = valueOrPartial as string;
      this.value = Utils.isGoodString(valueOrPartial) ? valueOrPartial : '9';
      this.width = Utils.isGoodNumber(width) ? width : 9;
      this.height = Utils.isGoodNumber(height) ? height : 9;
    }
  }
}
