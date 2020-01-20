import { FILE, NUMRANKS, SIDE } from '../src/ts/globals';
import { Cell } from '../src/ts/lib/Cell';
import { Pawn } from '../src/ts/lib/pieces/Pawn';

/**
 * Cell Factory
 */
export const CellFactory = function(params?: any) {
    let rndFile: FILE = Math.floor(Math.random() * (Object.keys(FILE).length / 2)),
        rndRank: number = Math.floor(Math.random() * NUMRANKS) + 1,
        rndLight: boolean = (rndFile * rndRank) % 2 == 0,
        cell: Cell = new Cell(rndFile, rndRank, rndLight);

    if(params != null) {
        if(params.hasOwnProperty('file'))
            cell.file = params.file;

        if(params.hasOwnProperty('rank'))
            cell.rank = params.rank;

        if(params.hasOwnProperty('isLight'))
            cell.isLight = params.isLight;
    }

    return cell;
};

/**
 * Piece Factory
 */
export const PieceFactory = function(customSide?: SIDE) {
    let side = customSide ? customSide 
        : (Math.floor(Math.random() * 2) + 1 == 1 ? SIDE.white : SIDE.black);
    // let type = PIECETYPE[Math.floor(Math.random() * Object.keys(PIECETYPE).length) + 1];
    
    return new Pawn(side);
};