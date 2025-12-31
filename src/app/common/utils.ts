export class Utils {
  /**
   * Checks if a value is undefined or null
   * @param value The value to check
   * @returns True if the value is undefined or null, false otherwise
   */
  public static isBad(value: unknown): value is undefined | null {
    return typeof value === 'undefined' || value === null;
  }
  /**
   * Checks if a value is not undefined and not null
   * @param value The value to check
   * @returns True if the value is not undefined and not null, false otherwise
   */
  public static isGood(value: unknown): boolean {
    return !Utils.isBad(value);
  }
  /**
   * Checks if a value is a valid array with optional minimum and maximum element counts
   * @param value The value to check
   * @param minCount The minimum number of elements the array must contain (inclusive, defaults to 1)
   * @param maxCount The maximum number of elements the array may contain (inclusive, defaults to Infinity)
   * @returns True if the value is a valid array, false otherwise
   */
  public static isGoodArray(value: unknown, minCount = 1, maxCount = Infinity): value is Array<unknown> {
    if (!Utils.isGood(value)) {
      return false;
    }
    return (Array.isArray(value) && value.length >= minCount && value.length <= maxCount);
  }
  /**
   * Checks if a value is a valid number with optional minimum and maximum bounds
   * @param value The value to check
   * @param min The minimum Number represented by value (inclusive, defaults to -Infinity)
   * @param max The maximum Number represented by value (inclusive, defaults to Infinity)
   * @returns True if the value is a valid number, false otherwise
   * @description Note that NaN is not considered a valid number, nor are bigint values
   */
  public static isGoodNumber(value: unknown, min = -Infinity, max = Infinity): value is number {
    return Utils.isGood(value) &&
      typeof value === 'number' &&
      !isNaN(value) &&
      value >= min &&
      value <= max;
  }
  /**
   * Checks if a value is a valid string with optional minimum and maximum length bounds
   * @param value The value to check
   * @param minLength The minimum length of the string value (inclusive, defaults to 1)
   * @param maxLength The maximum length to the string value (inclusive, defaults to Infinity)
   * @returns True if the value is a valid string, false otherwise
   * @description Note that empty strings are not considered valid, nor are strings that consist
   * entirely of whitespace characters (spaces, tabs, newlines, or carriage returns)
   */
  public static isGoodString(value: unknown, minLength = 1, maxLength = Infinity): value is string {
    return Utils.isGood(value) &&
      typeof value === 'string' &&
      value.length >= minLength &&
      value.length <= maxLength &&
      ![...value].every(c => [9,10,13,32].includes(c?.codePointAt(0) ?? 0)); // not all whitespace
  }
  /**
   * Checks if a value is a valid JSON string representation of an object or array
   * @param value The value to check
   * @param isArray If true and isObject is false, will check that value is a valid JSON representation
   * of an array. If false, check isObject parameter.
   * @param isObject If true and isArray is false, will check that value is a valid JSON representation
   * of an object. If false, and isArray is false, attempt to parse the value with JSON.parse.
   * @returns True if the value is a valid JSON string, false otherwise.
   */
  public static isGoodJson(value: unknown, isArray = false, isObject = false): value is string {
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
        isArray = Array.isArray(result);
        isObject = !isArray && typeof result === 'object';
      } catch {
        isArray = isObject = false;
        return false;
      }
      return true;
    }
  }
  /**
   * Checks if a CSS selector exists within a container element.
   * @param container The element in which selector is expected to exist.
   * @param selector The CSS selector to check for.
   * @returns True if the selector exists within the container, false otherwise.
   */
  public static selectorExists(container: HTMLElement, selector: string): boolean {
    return container.querySelector(selector) !== null;
  }
  /**
   * Checks if a CSS selector exists within a container element and is focusable.
   * @param container The element in which selector is expected to exist.
   * @param selector The CSS selector to check for.
   * @returns True if the selector exists within the container and is focusable, false otherwise.
   */
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
  /**
   * Compares two values to determine if they are the "same".
   * @param a The first value to compare
   * @param b The second value to compare
   * @returns True if the values are the "same"; that is, if two objects have the same
   * number, type, and value of properties.
   */
  public static haveSameValue(a: unknown, b: unknown): boolean {
    if ((!Utils.isGood(a) && Utils.isGood(b)) ||
        (Utils.isGood(a) && !Utils.isGood(b))) {
      return false;
    }
    if (a === b) {
      return true;
    }
    if ('valueOf' in (a as object) && 'valueOf' in (b as object)) {
      if (a?.valueOf() === b?.valueOf()) {
        return true;
      }
    }
    const aEntries = Object.entries(a ?? {});
    const bEntries = Object.entries(b ?? {});
    if (aEntries.every(([ak, av]) => bEntries.some(([bk, bv]) => bk === ak && Utils.haveSameValue(av, bv)))) {
      return true;
    }

    return false;
  }
  /**
   * Compares two arrays to determine if they are the "same".
   * @param a The first array to compare
   * @param b The second array to compare
   * @returns True if the arrays have the same number, type, and value (using haveSameValue) of entries.
   */
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
  private static _randomValues = new Uint8Array(256);
  private static _randomValuesBetween: Map<string, Uint8Array> = new Map();
  /**
   * Gets a cryptographically random value.
   */
  static getRandomValue(): number {
    if (this._randomValues != null && this._randomValues.length > 0) {
      // A Uint8Array's pop() method is not supported, so we use at(-1) and slice(-1)
      const lastValue = this._randomValues.at(-1);
      this._randomValues = this._randomValues.slice(-1);
      return lastValue ?? 0; // This will never be undefined / 0, since we
      // just checked if length > 0, but the linter is whining...
    }
    // Every call to window.crypto.getRandomValues will fill the values array with
    // random bytes. So do that once, then subsequent calls can just pop the numbers
    // off that array. When it empties, get more random numbers. This is a balancing
    // act between the processing time needed to generate the random bytes, and how
    // often it needs new random bytes.
    const values = new Uint8Array(256);
    if (globalThis && globalThis.crypto && globalThis.crypto.getRandomValues) {
      globalThis.crypto.getRandomValues(values);
    } else if (window && window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(values);
    }
    this._randomValues = new Uint8Array([...values]);
    return this.getRandomValue();
  }
  /**
   * Generates a random value between the specified values. If only one value is given,
   * it is considered the maximum, with the minimum set to 0. If no values are given,
   * min is set to 0 and max is set to 1.
   * @param {number?} min The minimum value to return (defaults to 0 if not supplied)
   * @param {number?} max The maximum value to return (defaults to 1 if not supplied)
   * @returns A random value between min and max
   */
  static getRandomValueBetween(min = 0, max = 1): number | undefined {
    min = min ?? 0;
    max = max ?? 1;
    if (max === 1 && min !== 0) {
      max = min;
      min = 0;
    }
    const random = this.getRandomValue();
    // random will be a number between 0 and 255, so fill an array with 256 numbers
    // For a given min/max combo, the array of possible values will always be the same
    // so cache it in a Map for easy retrieval.
    const key = JSON.stringify({ min, max });
    const possibleValues = this._randomValuesBetween.has(key)
      ? this._randomValuesBetween.get(key)
      : this._randomValuesBetween
        .set(
          key,
          new Uint8Array(
            Array
            .from({ length: 256 })
              .fill(0)
              .map((_, i) => Math.floor(((max - min) / 255) * i + min))
          )
        )
        .get(key);
    return possibleValues ? possibleValues[random] : undefined;
  }
}
