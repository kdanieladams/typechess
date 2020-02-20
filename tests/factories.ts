import { FILE, NUMRANKS, SIDE } from '../src/ts/globals';
import { Board } from '../src/ts/lib/Board';
import { Cell } from '../src/ts/lib/Cell';
import { ChessUiHtml } from '../src/ts/lib/ui/ChessUiHtml';
import { Pawn } from '../src/ts/lib/pieces/Pawn';


/**
 * Board Factory
 */
export const BoardFactory = function() {
    const jsdom = require('jsdom');
    const { JSDOM } = jsdom;
    let dom = new JSDOM(`<!DOCTYPE html><canvas id="test_canvas" width="640" height="640"></canvas><img id="test_img">`),
        document = dom.window.document;
    
    return new Board(document.getElementById('test_canvas'), document.getElementById('test_img'));
};

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
 * ChessUiHtml Factory
 */
export const ChessUiHtmlFactory = function(params?: any) {
    const jsdom = require('jsdom');
    const { JSDOM } = jsdom;
    let dom = new JSDOM(`<!DOCTYPE html><div id="chess_ui"></div>`),
        document = dom.window.document;

    return new ChessUiHtml(document.getElementById('chess_ui'));
};

/**
 * Piece Factory
 */
export const PieceFactory = function(customSide?: SIDE) {
    let side = customSide ? customSide 
        : (Math.floor(Math.random() * 2) + 1 == 1 ? SIDE.white : SIDE.black);
    // let type = PIECETYPE[Math.floor(Math.random() * Object.keys(PIECETYPE).length) + 1];
    
    return new Pawn(side, 0);
};