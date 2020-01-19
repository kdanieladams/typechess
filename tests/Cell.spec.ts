import { expect } from 'chai';
import { FILE } from '../src/ts/globals';
import { Cell } from '../src/ts/lib/Cell';
import 'mocha';

describe('Test Cell construction', () => {
    it('should return an instance of a Cell', () => {
        let cell = new Cell(FILE.a, 1, false);
        expect(cell).to.be.instanceOf(Cell);
    });
});