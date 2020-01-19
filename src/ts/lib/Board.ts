import { CELLWIDTH, DARKSQCOLOR, FILE, NUMFILES, NUMRANKS, LIGHTSQCOLOR } from '../globals';
import { Cell } from './Cell';

/**
 * Board
 */
export class Board {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    cells: Cell[] = new Array();
    pieces_img: HTMLImageElement;

    constructor(canvas: HTMLCanvasElement, pieces_img: HTMLImageElement) {
        this.canvas = canvas;
        this.pieces_img = pieces_img;
        this.ctx = canvas.getContext('2d');

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
        else if(!Object.keys(FILE).includes(coord[0])) {
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

        for(let i = 0; i < this.cells.length; i++) {
            let cell = this.cells[i];
            let xPos = cell.file * cellWidth;
            let yPos = (NUMRANKS * cellWidth) - (cellWidth * (cell.rank - 1)) - cellWidth;

            // draw the cell
            this.ctx.beginPath();
            this.ctx.fillStyle = cell.isLight ? lightCol : darkCol;
            this.ctx.fillRect(xPos, yPos, cellWidth, cellWidth);
            this.ctx.closePath();
        }
    }
}