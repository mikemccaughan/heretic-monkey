import { signal, WritableSignal } from '@angular/core';
import { Utils } from '../../common/utils';

export class SignalDifficulty {
  public static Easy: SignalDifficulty = new SignalDifficulty('9', 9, 9);
  public static Medium: SignalDifficulty = new SignalDifficulty('16', 16, 16);
  public static Hard: SignalDifficulty = new SignalDifficulty('30', 30, 16);
  public static Custom: SignalDifficulty = new SignalDifficulty('?', 0, 0);
  public static Default: SignalDifficulty = SignalDifficulty.Easy;

  private _parseValue(value: string): string | undefined {
    const parsed = Utils.toNumber(value);
    if (parsed === undefined || parsed < 0) {
      return undefined;
    }

    return value;
  }

  private defaultValue = SignalDifficulty?.Default?.value ?? '9';
  private defaultWidth = SignalDifficulty?.Default?.width ?? 9;
  private defaultHeight= SignalDifficulty?.Default?.height ?? 9;
  private _value: WritableSignal<string> = signal(this.defaultValue);
  private _width: WritableSignal<number> = signal(this.defaultWidth);
  private _height: WritableSignal<number> = signal(this.defaultHeight);

  public get value(): string {
    return this._value();
  }
  public set value(value: string) {
    this._value.set(this._parseValue(value) ?? SignalDifficulty?.Default?.value ?? '9');
    switch (this._value()) {
      case SignalDifficulty?.Easy?.value ?? '9':
        this._width.set(SignalDifficulty?.Easy?.width ?? 9);
        this._height.set(SignalDifficulty?.Easy?.height ?? 9);
        break;
      case SignalDifficulty?.Medium?.value ?? '16':
        this._width.set(SignalDifficulty?.Medium?.width ?? 16);
        this._height.set(SignalDifficulty?.Medium?.height ?? 16);
        break;
      case SignalDifficulty?.Hard?.value ?? '30':
        this._width.set(SignalDifficulty?.Hard?.width ?? 30);
        this._height.set(SignalDifficulty?.Hard?.height ?? 16);
        break;
      default:
        this._width.set(this.width ?? SignalDifficulty?.Custom?.width ?? 0);
        this._height.set(this.height ?? SignalDifficulty?.Custom?.height ?? 0);
        break;
    }
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

  constructor(
    valueOrPartial?: string | Partial<SignalDifficulty>,
    width?: number,
    height?: number
  ) {
    if (!Utils.isBad(valueOrPartial) && typeof valueOrPartial === 'object' && Object.hasOwn(valueOrPartial, 'value')) {
      valueOrPartial = valueOrPartial as Partial<SignalDifficulty>;
      let pValue = valueOrPartial.value ?? SignalDifficulty?.Default?.value ?? '9';
      pValue = this._parseValue(pValue) ?
        pValue :
        SignalDifficulty?.Default?.value ?? '9';
      const parsed = parseInt(pValue, 10);
      const pWidth = width ?? parsed ?? SignalDifficulty?.Default?.width ?? 9;
      const pHeight = height ?? parsed ?? SignalDifficulty?.Default?.height ?? 9;
      if (pValue === (SignalDifficulty?.Custom?.value ?? '?')) {
        this.width = pWidth;
        this.height = pHeight;
      }
      this.value = Utils.isGoodString(pValue) ?
        pValue :
        SignalDifficulty?.Default?.value ?? '9';
    } else if (Utils.isGoodString(valueOrPartial, 1)) {
      valueOrPartial = valueOrPartial as string;
      this.value = valueOrPartial;
    } else {
      this.value ??= SignalDifficulty?.Default?.value ?? '9';
    }
  }
}
