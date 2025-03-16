import { Difficulty } from "./Difficulty";
import { formatTime } from "./Timer";

export class Score {
  private _difficulty: Difficulty = new Difficulty({value:'9'});
  private _score: string = '00:00:00';

  constructor(difficulty?: Difficulty, score?: string | number | Date) {
    if (!difficulty && !score) {
      return;
    } else if (difficulty && score) {
      this.difficulty = difficulty;
      this.score = score;

    } else {
      throw new Error(`Invalid arguments sent to Score constructor`);
    }
  }

  public get difficulty(): Difficulty {
    return this._difficulty ?? new Difficulty({value:'9'});
  }
  public set difficulty(value: Difficulty) {
    if (this._difficulty && this._difficulty.value) {
      if (value && value.value) {
        if (this._difficulty.value !== value.value) {
          this._difficulty = value;
          return;
        }
      } else {
        console.warn(`The difficulty property of a Score must be set to a valid instance of the Difficulty class; got ${JSON.stringify(value)}`);
        return;
      }
    } else {
      if (value && value.value) {
        this._difficulty = value;
        return;
      } else {
        console.warn(`The difficulty property of a Score must be set to a valid instance of the Difficulty class; got ${JSON.stringify(value)}`);
        return;
      }
    }
  }
  public get score(): string {
    return this._score;
  }
  public set score(value: string | Date | number) {
    if (typeof value === 'number') {
      this.score = new Date(value);
    }

    if (typeof value === 'string' && /\d{2}\:\d{2}\:\d{2}/.test(value)) {
      this.score = new Date(`1970-01-01T${value}Z`);
    }

    if (typeof value === 'object' && value instanceof Date) {
      if (isNaN(value.valueOf())) {
        console.warn(`The value passed in, ${value}, is not a valid Date and cannot be formatted as a time`);
        return;
      } else {
        this._score = formatTime(value);
      }
    }
  }
  public get id(): string {
    return `${(this.difficulty?.value ?? '?')}-${this.score?.replaceAll(/\:/g,'_') ?? '00_00_00'}`;
  }
}

export class ScoreList extends Array<Score> {
  public static highScoreForDifficulty(scores: ScoreList, diff: Difficulty | string): Score {
    return ScoreList.forDifficulty(scores, diff).sort((a, b) => b.score.localeCompare(a.score)).at(0) ?? new Score();
  }
  public static forDifficulty(scores: ScoreList, diff: Difficulty | string): ScoreList {
    return scores.filter((score) => score.difficulty.value === ((typeof diff === 'string') ? diff : 'value' in diff ? diff.value : '00:00:00'));
  }
}
