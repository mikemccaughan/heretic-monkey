export class Difficulty {
  value: string;
  width?: number;
  height?: number;
  constructor(partial?: Partial<Difficulty>);
  constructor(
    valueOrPartial?: string | Partial<Difficulty>,
    width?: number,
    height?: number
  ) {
    if (valueOrPartial && valueOrPartial.hasOwnProperty('value')) {
      valueOrPartial = valueOrPartial as Partial<Difficulty>;
      const pValue = valueOrPartial.value;
      const pWidth =
        pValue === '-1' ? valueOrPartial.width : parseInt(pValue, 10);
      const pHeight =
        pValue === '-1'
          ? valueOrPartial.height
          : pValue === '30'
          ? 16
          : parseInt(pValue, 10);
      this.value = pValue ? pValue : '9';
      this.width = pWidth ? pWidth : 9;
      this.height = pHeight ? pHeight : 9;
    } else {
      valueOrPartial = valueOrPartial as string;
      this.value = valueOrPartial ? valueOrPartial : '9';
      this.width = width ? width : 9;
      this.height = height ? height : 9;
    }
  }
}
