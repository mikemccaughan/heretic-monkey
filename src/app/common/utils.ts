export class Utils {
  public static isGood(value: unknown): boolean {
    return typeof value !== 'undefined' && value !== null;
  }
  public static isGoodArray(value: unknown, minCount = 1, maxCount = Infinity): value is Array<unknown> {
    if (!Utils.isGood(value)) {
      return false;
    }
    return (Array.isArray(value) && value.length >= minCount && value.length <= maxCount);
  }
  public static isGoodString(value: unknown): value is string {
    return Utils.isGood(value) &&
      typeof value === 'string' &&
      value.length > 0 &&
      ![...value].every(c => [9,10,13,32].includes(c.codePointAt(0)))
  }
  public static isGoodJson(value: unknown, isArray = false, isObject = false): boolean {
    if (!Utils.isGoodString(value)) {
      return false;
    }
    let charsToFind = ['{','}'];
    if (isArray) {
      charsToFind = ['[',']'];
    }
    if (isObject && isArray) {
      throw new SyntaxError('isGoodJson must be called with either isArray or isObject as true, not both');
    } else if (isObject || isArray) {
      // If we know what to expect, just do basic startsWith/endsWith validation
      const indexOfCharsToFind = [
        [...value].findIndex((c: string) => c === charsToFind[0]),
        [...value].findLastIndex((c: string) => c === charsToFind[1])
      ];
      const indexesOfOtherChars = [
        [...value].findIndex((c: string) => /\p{L}|\p{N}|\p{S}/u.test(c) || c === '"'),
        [...value].findLastIndex((c: string) => /\p{L}|\p{N}|\p{S}/u.test(c) || c === '"')
      ];
      return indexOfCharsToFind[0] < indexesOfOtherChars[0] &&
        indexOfCharsToFind[1] > indexesOfOtherChars[1];
    } else {
      // Only in extreme cases, parse the JSON and return false if it fails
      try {
        const result = JSON.parse(value);
      } catch {
        return false;
      }
      return true;
    }
  }
  public static selectorExists(container: HTMLElement, selector: string): boolean {
    return container.querySelector(selector) !== null;
  }
  public static selectorFocusable(container: HTMLElement, selector: string): boolean {
    const focusableSelector = `:is(a[href]:not([tabindex='-1']),
  area[href]:not([tabindex='-1']),
  input:not([disabled]):not([tabindex='-1']):not([type="hidden"]),
  select:not([disabled]):not([tabindex='-1']),
  textarea:not([disabled]):not([tabindex='-1']),
  button:not([disabled]):not([tabindex='-1']),
  iframe:not([tabindex='-1']),
  [tabindex]:not([tabindex='-1']),
  [contentEditable=true]:not([tabindex='-1']))`;
    const exists = Utils.selectorExists(container, selector+focusableSelector);

    return exists;
  }
  public static haveSameValue(a: unknown, b: unknown): boolean {
    if ((!Utils.isGood(a) && Utils.isGood(b)) ||
        (Utils.isGood(a) && !Utils.isGood(b))) {
      return false;
    }
    if (a === b) {
      return true;
    }
    if ('valueOf' in (a as object) && 'valueOf' in (b as object)) {
      if (a.valueOf() === b.valueOf()) {
        return true;
      }
    }
    const aEntries = Object.entries(a);
    const bEntries = Object.entries(b);
    if (aEntries.every(([ak, av]) => bEntries.some(([bk, bv]) => bk === ak && Utils.haveSameValue(av, bv)))) {
      return true;
    }

    return false;
  }
  public static haveSameValues<T extends Array<unknown>>(a: T, b: T): boolean {
    if ((!Utils.isGood(a) && Utils.isGood(b)) ||
        (Utils.isGood(a) && !Utils.isGood(b))) {
      return false;
    }
    if (a === b) {
      return true;
    }
    if (a.length !== b.length) {
      return false;
    }
    if (a.every((av: unknown) => b.some((bv: unknown) => Utils.haveSameValue(av, bv)))) {
      return true;
    }

    return false;
  }
}
