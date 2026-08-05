import { SignalBoard, SignalDifficulty } from ".";
import { MynsweeprSignalsMineboardService } from "../mineboard.service";

export interface IBuildable {
    board: SignalBoard;
    preboard: number[][];

    sortCells(): void;
    initPreboard(): void;
    populatePreboard(): void;
    buildCells(): void;
    buildBoard(
        statusChange: (status: string) => void,
        difficulty?: SignalDifficulty
    ): SignalBoard;
}

export class BaseBuildable implements IBuildable {
    public board: SignalBoard = new SignalBoard();
    public preboard: number[][] = [];

    constructor(board: SignalBoard) {
        this.board = board;
    }

    sortCells(): void {
        window.performance.mark('mynsweepr.service sortCells start');
        const isNotSorted = this.board.cells.some((c, i) => c.index !== i);
        if (isNotSorted) {
            this.board.cells = this.board.cells.sort(
                (a, b) => (a.index || 0) - (b.index || 0)
            );
        }
        window.performance.mark('mynsweepr.service sortCells end');
        window.performance.measure(
            'mynsweepr.service sortCells',
            'mynsweepr.service sortCells start',
            'mynsweepr.service sortCells end'
        );
    }
    initPreboard(): void {
        window.performance.mark('mynsweepr.service initPreboard start');
        this.preboard = [];
        for (let y = 0; y < this.board.difficulty.height; y++) {
            this.preboard[y] = [];
            for (let x = 0; x < this.board.difficulty.width; x++) {
                this.preboard[y][x] = 0;
            }
        }
        window.performance.mark('mynsweepr.service initPreboard end');
        window.performance.measure(
            'mynsweepr.service initPreboard',
            'mynsweepr.service initPreboard start',
            'mynsweepr.service initPreboard end'
        );
    }
    populatePreboard(): void {
        window.performance.mark('mynsweepr.service populatePreboard start');
        const cellCount =
            this.board.difficulty.width * this.board.difficulty.height;
        const mineCount = Math.floor(cellCount / 6);
        const value = -(mineCount * 2);
        const isBetween = (val: number, min: number, max: number): boolean =>
            val >= min && val <= max;
        for (let i = 0; i < mineCount; i++) {
            let x: number;
            let y: number;
            while (true) {
                x = Math.floor(Math.random() * this.board.difficulty.width);
                y = Math.floor(Math.random() * this.board.difficulty.height);
                if (0 <= this.preboard[y][x]) {
                    break;
                }
            }
            for (let m = -1; m < 2; m++) {
                for (let n = -1; n < 2; n++) {
                    if (n === 0 && m === 0) {
                        this.preboard[y][x] = value;
                    } else if (
                        isBetween(y + n, 0, this.board.difficulty.height - 1) &&
                        isBetween(x + m, 0, this.board.difficulty.width - 1)
                    ) {
                        this.preboard[y + n][x + m]++;
                    }
                }
            }
        }
        window.performance.mark('mynsweepr.service populatePreboard end');
        window.performance.measure(
            'mynsweepr.service populatePreboard',
            'mynsweepr.service populatePreboard start',
            'mynsweepr.service populatePreboard end'
        );
    }
    buildCells(): void {
        window.performance.mark('mynsweepr.service buildCells start');
        this.board.cells = [];
        let cellIndex = 0;
        for (let y = 0; y < this.board.difficulty.height; y++) {
            for (let x = 0; x < this.board.difficulty.width; x++) {
                const cell = MynsweeprSignalsMineboardService.createCell(
                    x,
                    y,
                    this.preboard[y][x],
                    cellIndex
                );
                this.board.cells[cellIndex] = cell;
                cellIndex++;
            }
        }
        this.board.populateBoardByCoord();
        window.performance.mark('mynsweepr.service buildCells end');
        window.performance.measure(
            'mynsweepr.service buildCells',
            'mynsweepr.service buildCells start',
            'mynsweepr.service buildCells end'
        );
    }
    buildBoard(
        statusChange: (status: string) => void,
        difficulty?: SignalDifficulty
    ): SignalBoard {
        window.performance.mark('mynsweepr.service buildBoard start');
        this.board = new SignalBoard();
        this.board.statusChange.subscribe(statusChange);
        this.board.difficulty = new SignalDifficulty(difficulty);
        this.initPreboard();
        this.populatePreboard();
        this.buildCells();
        this.sortCells();
        window.performance.mark('mynsweepr.service buildBoard end');
        window.performance.measure(
            'mynsweepr.service buildBoard',
            'mynsweepr.service buildBoard start',
            'mynsweepr.service buildBoard end'
        );
        return this.board;
    }

}