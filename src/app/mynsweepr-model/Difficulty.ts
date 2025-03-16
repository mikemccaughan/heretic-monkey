import { Utils } from '../common/utils';
export class Difficulty {
  value: string = '9';
  width: number = 9;
  height: number = 9;
  public static Easy: Difficulty = new Difficulty('9');
  public static Medium: Difficulty = new Difficulty('16');
  public static Hard: Difficulty = new Difficulty('30');
  public static Default: Difficulty = Difficulty.Easy;
  constructor(
    valueOrPartial?: string | Partial<Difficulty>,
    width?: number,
    height?: number
  ) {
    if (!Utils.isBad(valueOrPartial) && valueOrPartial.hasOwnProperty('value')) {
      valueOrPartial = valueOrPartial as Partial<Difficulty>;
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
