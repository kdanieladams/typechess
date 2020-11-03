import { FILE, NUMRANKS } from '../globals';
import { Piece } from './pieces/_Piece';

/**
 * Cell
 */
export class Cell {
    // public
    castleable: boolean = false;
    file: FILE = 0;
    isLight: boolean = false;
    possibleMove: boolean = false;
    piece: Piece = null;
    rank: number = 0;

    constructor(file: FILE, rank: number, isLight: boolean) {
        if(rank > NUMRANKS || rank < 1) {
            console.error("Cell.constructor: Invalid rank value.");
            return null;
        }

        this.file = file;
        this.rank = rank;
        this.isLight = !!isLight ? true : false;

        return this;
    }

    getFile() {
        return FILE[this.file];
    }
    
    getCoord() {
        return "" + this.getFile() + this.rank;
    }

    isOccupied() {
        return this.piece != null;
    }
}