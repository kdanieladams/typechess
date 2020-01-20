import { expect } from 'chai';
import { FILE } from '../src/ts/globals';
import { Cell } from '../src/ts/lib/Cell';
import { CellFactory } from './factories';
import { PieceFactory } from './factories';
import 'mocha';

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
            let piece = PieceFactory(); // new Pawn(SIDE.white);
            cell.piece = piece;
            expect(cell.isOccupied()).to.be.true;
        });
    
        it('should return false if the cell is not assigned a piece', () => {
            let cell = CellFactory();
            expect(cell.isOccupied()).to.be.false;
        });
    });
});
