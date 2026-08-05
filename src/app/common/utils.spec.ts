import { Utils } from './utils';

describe('Utils', () => {
  describe('haveSameValue', () => {
    it('returns true if both values are undefined', () => {
      const a = undefined, b = undefined;
      expect(Utils.haveSameValue(a, b)).toBeTrue();
    })
  });
});
