import { Utils } from '../../common';
import { wait } from '../../mynsweepr-model';
import { ISignalBoardTraversalOptions, SignalBoard, SignalCell } from './';
import { BaseBoardTraversalOptions } from './ISignalBoardTraversalOptions';

export interface ITraversable {
    /**
     * The board to traverse. This is required for all traversal operations.
     */
    board: SignalBoard;

    // #region traversal options
    /**
     * The traveral options when traversing the board.
     */
    traversalOptions: ISignalBoardTraversalOptions;
    /**
     * 
     * @param existingOptions The operations for traversal.
     */
    applyTraversalOptions(existingOptions: Partial<ISignalBoardTraversalOptions>): ISignalBoardTraversalOptions;
    // #endregion traversal options

    // #region traversal methods
    decrementX(x: number): number;
    decrementY(y: number): number;
    incrementX(x: number): number;
    incrementY(y: number): number;
    getCellByCoord(x: number, y: number): SignalCell | undefined;
    isHiddenByCoord(x: number, y: number): boolean;
    isContiguousWithOriginal(cell: SignalCell, original: SignalCell): boolean;
    // #endregion traversal methods

    // #region specialized traversal methods
    cellIsInHistory(
        cell: SignalCell,
        options: ISignalBoardTraversalOptions
    ): boolean;

    getCellsForRevealAround(options: ISignalBoardTraversalOptions): Set<SignalCell>;
    
    getCellsForEpicFail(options: ISignalBoardTraversalOptions): Set<SignalCell>;
    epicFail(cell: SignalCell): void;

    addForEpicWin(cell: SignalCell, originalCell: SignalCell): boolean;
    getCellsForEpicWin(options: ISignalBoardTraversalOptions): Set<SignalCell>;
    epicWin(cell: SignalCell): SignalCell;
    // #endregion specialized traversal methods
}

export class BaseTraversable implements ITraversable {
    board: SignalBoard = new SignalBoard();
    //#region board traversal
    traversalOptions: ISignalBoardTraversalOptions = new BaseBoardTraversalOptions(this.board, this, undefined, []);
    applyTraversalOptions(existingOptions: Partial<ISignalBoardTraversalOptions>): ISignalBoardTraversalOptions {
        return {
            ...existingOptions,
            ...this.traversalOptions
        }
    }
    decrementX(x: number): number {
        return x === 0 ? x : x - 1;
    }
    decrementY(y: number): number {
        return y === 0 ? y : y - 1;
    }
    incrementX(x: number): number {
        const value = this.board?.difficulty?.width ?? 0;
        return x === value - 1
            ? value - 1
            : x + 1;
    }
    incrementY(y: number): number {
        const value = this.board?.difficulty?.height ?? 0;
        return y === value - 1
            ? value - 1
            : y + 1;
    }
    getCellByCoord(x: number, y: number): SignalCell {
        if (Utils.isBad(this.board)) {
            throw new Error('Board not initialized');
        }
        return this.board.cellsByCoords[SignalBoard.getCoord(x, y)] ?? new SignalCell();
    }
    isHiddenByCoord(x: number, y: number): boolean {
        const cell = this.getCellByCoord(x, y);
        if (!cell) {
            throw new Error(`No cell at (x, y): (${x}, ${y})`);
        }
        return cell.isHidden;
    }
    isContiguousWithOriginal(cell: SignalCell, original: SignalCell): boolean {
        const result =
            cell.index === original.index ||
            (cell.x === original.x && cell.y === original.y + 1) ||
            (cell.x === original.x + 1 && cell.y === original.y + 1) ||
            (cell.x === original.x - 1 && cell.y === original.y + 1) ||
            (cell.x === original.x && cell.y === original.y - 1) ||
            (cell.x === original.x + 1 && cell.y === original.y - 1) ||
            (cell.x === original.x - 1 && cell.y === original.y - 1) ||
            (cell.y === original.y && cell.x === original.x + 1) ||
            (cell.y === original.y && cell.x === original.x - 1);
        return result;
    }
    //#endregion board traversal

    //#region special case board traversal
    cellIsInHistory(
        cell: SignalCell,
        options: ISignalBoardTraversalOptions
    ): boolean {
        return (
            (options.cellHistory || []).findIndex(ce => ce.index === cell.index) === -1
        );
    }

    getCellsForRevealAround(options: ISignalBoardTraversalOptions): Set<SignalCell> {
        window.performance.mark('mynsweepr.service getCellsForRevealAround start');
        options.cellHistory = [...(options.cellHistory || []), options.cell];
        options.result = new Set<SignalCell>([
            ...options.result,
            ...this.board.cells.filter(options.addToResult)
        ]);
        this.applyTraversalOptions(options);
        //return options.result;
        window.performance.mark('mynsweepr.service getCellsForRevealAround end');
        window.performance.measure(
            'mynsweepr.service getCellsForRevealAround',
            'mynsweepr.service getCellsForRevealAround start',
            'mynsweepr.service getCellsForRevealAround end'
        );

        return options.result;
    }

    getCellsForEpicFail(options: ISignalBoardTraversalOptions): Set<SignalCell> {
        this.traversalOptions = this.applyTraversalOptions(options);
        return new Set<SignalCell>(this.board.cells.filter(options.addToResult));
    }
    epicFail(cell: SignalCell): void {
        if (!cell) {
            throw new Error(`No cell`);
        }

        window.performance.mark('mynsweepr.service epicFail start');
        let cellsToUpdate = new Set<SignalCell>();
        const options: ISignalBoardTraversalOptions = {
            ...this.traversalOptions,
            addToResult: (cel: SignalCell) => !!cel && cel.isHidden,
            cell,
            result: cellsToUpdate,
            cellHistory: [cell]
        };
        cellsToUpdate = this.getCellsForEpicFail(options);
        cellsToUpdate.forEach(cel => cel.isHidden = false);
        wait(100).then(() => this.board.hadChange = !this.board.hadChange);
        window.performance.mark('mynsweepr.service epicFail end');
        window.performance.measure(
            'mynsweepr.service epicFail',
            'mynsweepr.service epicFail start',
            'mynsweepr.service epicFail end'
        );
    }

    addForEpicWin(cell: SignalCell, originalCell: SignalCell): boolean {
        return (
            cell.isHidden &&
            !cell.hasMine &&
            !cell.hasFlag &&
            this.isContiguousWithOriginal(cell, originalCell)
        );
    }
    getCellsForEpicWin(options: ISignalBoardTraversalOptions): Set<SignalCell> {
        window.performance.mark('mynsweepr.service getCellsForEpicWin start');
        options.cellHistory = [...(options.cellHistory || []), options.cell];

        options.result = new Set<SignalCell>([
            ...options.result,
            ...this.board.cells.filter(options.addToResult)
        ]);
        for (const cell of [...options.result].filter(
            c =>
                c.value === 0 &&
                options.cell.index !== c.index &&
                this.cellIsInHistory(c, options)
        )) {
            options.cell = cell;
            options.addToResult = cel =>
                cel && cel.isHidden && !cel.hasMine && this.addForEpicWin(cel, cell);
            options.result = new Set<SignalCell>([
                ...options.result,
                ...this.getCellsForEpicWin(options)
            ]);
        }
        window.performance.mark('mynsweepr.service getCellsForEpicWin end');
        window.performance.measure(
            'mynsweepr.service getCellsForEpicWin',
            'mynsweepr.service getCellsForEpicWin start',
            'mynsweepr.service getCellsForEpicWin end'
        );
        return options.result;
    }
    epicWin(cell: SignalCell): SignalCell {
        if (!cell) {
            throw new Error(`No cell`);
        }

        window.performance.mark('mynsweepr.service epicWin start');
        let cellsToUpdate = new Set<SignalCell>();
        const options: ISignalBoardTraversalOptions = {
            ...this.traversalOptions,
            addToResult: (cel: SignalCell) =>
                cel && cel.isHidden && !cel.hasMine && this.addForEpicWin(cel, cell),
            cell,
            result: cellsToUpdate,
            cellHistory: [cell]
        };
        cellsToUpdate = this.getCellsForEpicWin(options);
        cellsToUpdate.forEach((cel) => cel.isHidden = false);
        wait(100).then(() => this.board.hadChange = !this.board.hadChange);
        window.performance.mark('mynsweepr.service epicWin end');
        window.performance.measure(
            'mynsweepr.service epicWin',
            'mynsweepr.service epicWin start',
            'mynsweepr.service epicWin end'
        );
        return cell;
    }
    //#endregion special case board traversal

}