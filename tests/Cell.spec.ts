import { expect } from 'chai';
import { FILE, NUMRANKS, SIDE } from '../src/ts/globals';
import { Cell } from '../src/ts/lib/Cell';
import { Pawn } from '../src/ts/lib/pieces/Pawn';
import 'mocha';

/**
 * Factory
 */
const CellFactory = function(params?: any) {
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
 * Cell Tests
 */
describe('Test Cell', () => {
    it('should be constructable', () => {
        let cell = CellFactory();
        expect(cell).to.be.instanceOf(Cell);
    });

    describe('getFile()', () => {
        it('should return the file text-label', () => {
            let cell = CellFactory({ file: FILE.c })
            expect(cell.getFile()).to.equal('c');
        })
    });
    
    describe('getCoord()', () => {
        it('should return the complete file-first coordinate of the cell', () => {
            let cell = CellFactory({ file: FILE.g, rank: 7 });
            expect(cell.getCoord()).to.equal('g7');
        })
    });
    
    describe('isOccupied()', () => {
        it('should return true if the cell is assigned a piece', () => {
            let cell = CellFactory();
            let piece = new Pawn(SIDE.white);
            cell.piece = piece;
            expect(cell.isOccupied()).to.be.true;
        });
    
        it('should return false if the cell is not assigned a piece', () => {
            let cell = CellFactory();
            expect(cell.isOccupied()).to.be.false;
        });
    });
});
