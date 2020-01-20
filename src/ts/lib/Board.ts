import { CANVASMARGIN, CELLWIDTH, DARKSQCOLOR, FILE, NUMFILES, NUMRANKS, LIGHTSQCOLOR } from '../globals';
import { Cell } from './Cell';

/**
 * Board
 */
export class Board {
    private _canvas_offset_x: number = 0;
    private _canvas_offset_y: number = 0;

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    cells: Cell[] = new Array();
    pieces_img: HTMLImageElement;

    constructor(canvas: HTMLCanvasElement, pieces_img: HTMLImageElement) {
        this.canvas = canvas;
        this.pieces_img = pieces_img;
        this.ctx = canvas.getContext('2d');

        let boardWidth = NUMFILES * CELLWIDTH,
            boardHeight = NUMRANKS * CELLWIDTH;
        this._canvas_offset_x = (canvas.width - boardWidth) / 2;
        this._canvas_offset_y = CANVASMARGIN + 150;

        for(let row = 0; row < NUMRANKS; row++) {
            for(let col = 0; col < NUMFILES; col++) {
                let isLight = (row + col) % 2 ? true : false;
                this.cells.push(new Cell(col, row + 1, isLight));
            }
        }
    }

    private _validateCoord(coord: string) {
        // a valid coordinate is presented as file + rank in a 
        // two character string; e.g. "d4"
        if(coord.length != 2) {
            return false;
        }
        else if(!isNaN(parseInt(coord[0])) || !Object.keys(FILE).includes(coord[0])) {
            return false;
        }
        else {
            let coordRank = parseInt(coord[1]);
            if(isNaN(coordRank) || coordRank > NUMRANKS || coordRank < 1) {
                return false;
            }

            return true;
        }
    }

    cellInBounds(coord: string) {
        return this._validateCoord(coord);
    }

    draw() {
        let lightCol = LIGHTSQCOLOR,
            darkCol = DARKSQCOLOR,
            cellWidth = CELLWIDTH;

        this.cells.forEach(cell => {
            let xPos = (cell.file * cellWidth) + this._canvas_offset_x;
            let yPos = ((NUMRANKS * cellWidth) - (cellWidth * (cell.rank - 1)) - cellWidth) + this._canvas_offset_y;

            // draw the cell
            this.ctx.beginPath();
            this.ctx.fillStyle = cell.isLight ? lightCol : darkCol;
            this.ctx.fillRect(xPos, yPos, cellWidth, cellWidth);
            this.ctx.closePath();
        });
    }

    getCellByCoord(coord: string) {
        if(!this._validateCoord(coord)) {
            console.error('Board.getCellByCoord: invalid coord value.');
            return;
        }

        var file = coord[0];
        var rank = parseInt(coord[1]);
        var index = ((rank * NUMFILES) - NUMRANKS) + FILE[file];

        return this.cells[index];
    }

    getCellByPixels(xPos: number, yPos: number) {
        var file = FILE[Math.floor((xPos - this._canvas_offset_x) / CELLWIDTH)];
        var rank = NUMRANKS - Math.floor((yPos - this._canvas_offset_y) / CELLWIDTH);

        return this.getCellByCoord("" + file + rank);
    }
}