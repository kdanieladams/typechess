import { expect } from 'chai';
import { NUMFILES, NUMRANKS } from '../src/ts/globals';
import { Board } from '../src/ts/lib/Board';
import { BoardFactory } from './factories';
import { Cell } from '../src/ts/lib/Cell';
import 'mocha';

/**
 * Board Tests
 */
describe('Test Board', () => {
    let brd: Board;

    before(() => {
        brd = BoardFactory();
    });

    it('should be constructable', () => {
        expect(brd).to.be.instanceOf(Board);
    });

    it('should instantiate itself with an appropriate number of cells', () => {
        expect(brd.cells.length).to.equal(NUMFILES * NUMRANKS);
        brd.cells.forEach(cell => {
            expect(cell).to.be.instanceOf(Cell);
        })
    });

    describe('cellInBounds()', () => {
        it('should return false for all invalid coords', () => {
            let invalidCoords: string[] = ['z9', 'g37', 'i2'];
    
            invalidCoords.forEach(coord => {
                let result = brd.cellInBounds(coord);
                expect(result).to.be.false;
            })
        });
    
        it('should return true for all valid coords', () => {
            let validCoords: string[] = ['a1', 'g7', 'b3'];
    
            validCoords.forEach(coord => {
                let result = brd.cellInBounds(coord);
                expect(result).to.be.true;
            })
        });
    });

    describe('draw()', () => {
        it('should be able to draw without errors', () => {
            let err: Error;
            
            try {
                brd.draw();
            }
            catch(e) {
                err = e;
            }

            expect(err).to.equal(undefined);
        });
    });

    describe('getCellByCoord()', () => {
        it('should return a Cell instance when provided with a valid coord', () => {
            let coord = 'b3',
                cell = brd.getCellByCoord(coord);

            expect(cell).to.be.instanceOf(Cell);
        });
    });

    describe('getCellByPixels()', () => {
        it('should return a Cell instance when provided with pixel coordinates within the boundary of the board', () => {
            let xPos = 216,
                yPos = 286,
                cell = brd.getCellByPixels(xPos, yPos);

            expect(cell).to.be.instanceOf(Cell);
        })
    });
});
