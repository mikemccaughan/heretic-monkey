import { signal,WritableSignal } from '@angular/core';
import { SignalDifficulty, formatTime } from "./";

export class SignalScore {
  private _difficulty: WritableSignal<SignalDifficulty> = signal(SignalDifficulty.Default);
  private _score: WritableSignal<string> = signal('00:00:00');

  constructor(difficulty?: SignalDifficulty, score?: string | number | Date) {
    if (!difficulty && !score) {
      return;
    } else if (difficulty && score) {
      this.difficulty = difficulty;
      this.score = score;

    } else {
      throw new Error(`Invalid arguments sent to Score constructor`);
    }
  }

  public get difficulty(): SignalDifficulty {
    return this._difficulty() ?? new SignalDifficulty('9');
  }
  public set difficulty(value: SignalDifficulty) {
    if (this._difficulty()) {
      if (value && value.value) {
        if (this._difficulty().value !== value.value) {
          this._difficulty.set(new SignalDifficulty(value));
          return;
        }
      } else {
        console.warn(`The difficulty property of a Score must be set to a valid instance of the Difficulty class; got ${JSON.stringify(value)}`);
        return;
      }
    } else {
      if (value && value.value) {
        this._difficulty.set(new SignalDifficulty(value));
        return;
      } else {
        console.warn(`The difficulty property of a Score must be set to a valid instance of the Difficulty class; got ${JSON.stringify(value)}`);
        return;
      }
    }
  }
  public get score(): string {
    return this._score();
  }
  public set score(value: string | Date | number) {
    if (typeof value === 'number') {
      this._score.set(formatTime(new Date(value)));
    }

    if (typeof value === 'string' && /\d{2}\:\d{2}\:\d{2}/.test(value)) {
      this._score.set(formatTime(new Date(`1970-01-01T${value}Z`)));
    } else if (typeof value === 'string' && !/\d{2}\:\d{2}\:\d{2}/.test(value)) {
      console.warn(`The value passed in, ${value}, is not a valid Date and cannot be formatted as a time`);
      return;
    }

    if (typeof value === 'object' && value instanceof Date) {
      if (isNaN(value.valueOf())) {
        console.warn(`The value passed in, ${value}, is not a valid Date and cannot be formatted as a time`);
        return;
      } else {
        this._score.set(formatTime(value));
      }
    }
  }
  public get id(): string {
    return `${(this.difficulty?.value ?? '?')}-${this.score?.replaceAll(/\:/g,'_') ?? '00_00_00'}`;
  }
}

export class SignalScoreList extends Array<SignalScore> {
  constructor(...items: SignalScore[]) {
    super(
      ...items
        .filter(s => s?.hasOwnProperty('score') && s?.hasOwnProperty('difficulty'))
        .map(s => new SignalScore(new SignalDifficulty(s['difficulty']), s['score']))
    );
  }
  public static Default: SignalScoreList = new SignalScoreList();
  public static highScoreForDifficulty(scores: SignalScoreList, diff: SignalDifficulty | string): SignalScore {
    const diffValue = ((typeof diff === 'string') ? diff : 'value' in diff ? diff.value : '9');
    return SignalScoreList.forDifficulty(scores, diff).at(0) ?? new SignalScore(new SignalDifficulty(diffValue));
  }
  public static forDifficulty(scores: SignalScoreList, diff: SignalDifficulty | string, max: number = 5): SignalScoreList {
    const diffValue = ((typeof diff === 'string') ? diff : 'value' in diff ? diff.value : '9');
    const simplified = scores.map(score => ({
      diff: (score.difficulty ?? score['_difficulty'])?.value ?? '9',
      score: (score.score ?? score['_score'])
    }));
    return new SignalScoreList(
      ...simplified
        .filter((scr) => scr.diff === diffValue)
        .sort((a, b) => (a.score ?? '00:00:00').localeCompare(b.score ?? '00:00:00'))
        .slice(-1 * max)
        .map((scr) => new SignalScore(new SignalDifficulty(scr.diff), scr.score))
    );
  }
}
