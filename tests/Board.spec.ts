import { expect } from 'chai';
import { Board } from '../src/ts/lib/Board';
import 'mocha';

/**
 * DOM boiler-plate
 */
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
let dom = new JSDOM(`<!DOCTYPE html>
    <canvas id="test_canvas"></canvas>
    <img id="test_img">`),
    document = dom.window.document,
    brd: Board = new Board(document.getElementById('test_canvas'), document.getElementById('test_img'));

/**
 * Tests
 */
describe('Test Board construction', () => {
    it('should return an instance of a Board', () => {
        expect(brd).to.be.instanceOf(Board);
    })
});

describe('Test Board coordinate validation', () => {
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
