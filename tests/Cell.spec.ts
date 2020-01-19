import { expect } from 'chai';
import { FILE } from '../src/ts/globals';
import { Cell } from '../src/ts/lib/Cell';
import { Piece } from '../src/ts/lib/pieces/_Piece';
import 'mocha';

describe('Test Cell construction', () => {
    it('should return an instance of a Cell', () => {
        let cell = new Cell(FILE.a, 1, false);
        expect(cell).to.be.instanceOf(Cell);
    });
});

describe('Test Cell getFile', () => {
    it('should return the file text-label', () => {
        let cell = new Cell(FILE.c, 4, true);
        expect(cell.getFile()).to.equal('c');
    })
});

describe('Test Cell getCoord', () => {
    it('should return the complete file-first coordinate of the cell', () => {
        let cell = new Cell(FILE.g, 7, false);
        expect(cell.getCoord()).to.equal('g7');
    })
});

describe('Test Cell isOccupied', () => {
    it('should return true if the cell is assigned a piece', () => {
        let cell = new Cell(FILE.b, 3, true);
        let piece = new Piece();
        cell.piece = piece;
        expect(cell.isOccupied()).to.be.true;
    });

    it('should return false if the cell is not assigned a piece', () => {
        let cell = new Cell(FILE.a, 2, false);
        expect(cell.isOccupied()).to.be.false;
    });
});
