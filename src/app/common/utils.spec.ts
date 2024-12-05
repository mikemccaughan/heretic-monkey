import { Utils } from './utils';

describe('Utils', () => {
  describe('haveSameValue', () => {
    it('returns true if both values are undefined', () => {
      let a, b;
      expect(Utils.haveSameValue(a, b)).toBeTrue();
    })
  });
});
