import { SignalDifficulty } from './SignalDifficulty.js';

describe('SignalDifficulty', () => {
    describe('constructor', () => {
        it('should create a Difficulty instance with default values when no arguments are provided', () => {
            const difficulty = new SignalDifficulty();
            expect(difficulty.value).toBe(SignalDifficulty.Default.value);
            expect(difficulty.width).toBe(SignalDifficulty.Default.width);
            expect(difficulty.height).toBe(SignalDifficulty.Default.height);
        });
        it('should create a Difficulty instance with the given value when first argument provided as the string "9"', () => {
            const difficulty = new SignalDifficulty('9');
            expect(difficulty.value).toBe('9');
            expect(difficulty.width).toBe(9);
            expect(difficulty.height).toBe(9);
        });
        it('should create a Difficulty instance with the given value when first argument provided as the string "16"', () => {
            const difficulty = new SignalDifficulty('16');
            expect(difficulty.value).toBe('16');
            expect(difficulty.width).toBe(16);
            expect(difficulty.height).toBe(16);
        });
        it('should create a Difficulty instance with the given value when first argument provided as the string "30"', () => {
            const difficulty = new SignalDifficulty('30');
            expect(difficulty.value).toBe('30');
            expect(difficulty.width).toBe(30);
            expect(difficulty.height).toBe(16);
        });
        it('should create a Difficulty instance with the given value when first argument provided as a Partial<SignalDifficulty> object', () => {
            const difficulty = new SignalDifficulty({ value: '?', width: 42, height: 42 });
            expect(difficulty.value).toBe('?');
            expect(difficulty.width).toBe(42);
            expect(difficulty.height).toBe(42);
        });
    });
});
