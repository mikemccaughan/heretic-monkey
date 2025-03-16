import { Utils } from "../common";

export class Difficulty {
  value: string;
  width: number;
  height: number;
  static Easy: Difficulty = new Difficulty({value:'9'});
  static Medium: Difficulty = new Difficulty({value:'16'});
  static Hard: Difficulty = new Difficulty({value:'30'});
  constructor(partial?: Partial<Difficulty>);
  constructor(
    valueOrPartial?: string | Partial<Difficulty>,
    width?: number,
    height?: number
  ) {
    if (valueOrPartial && valueOrPartial.hasOwnProperty('value')) {
      valueOrPartial = valueOrPartial as Partial<Difficulty>;
      const pValue = valueOrPartial.value ?? '9';
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
