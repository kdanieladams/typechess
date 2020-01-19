import { CAPITALIZE, GETENUMKEY, PIECESPRITEWIDTH, PIECETYPE, SIDE } from '../../globals';
import { Cell } from '../Cell';

export abstract class Piece {
    // protected
    protected _cell: Cell = null;
    protected _forward = 1;

    // public
    active = false;
    captured = false;
    possibleMoves = new Array();
    side = SIDE.white;
    type = PIECETYPE.pawn;
    value = 100;

    constructor(side: SIDE, type: PIECETYPE) {
        this.side = side;
        this.type = type;
        this._forward = this.side == SIDE.white ? 1 : -1; // -1 = down, 1 = up
    }

    // canMove() {
    //     console.error("Piece.canMove: canMove has not been implemented!");
    // }

    draw(img: HTMLImageElement, ctx: CanvasRenderingContext2D, xPos: number, yPos: number, cellWidth: number) {
        var clipX = img.naturalWidth - (this.type * PIECESPRITEWIDTH),
            clipY = this.side == SIDE.white ? 0 : PIECESPRITEWIDTH,
            clipWidth = PIECESPRITEWIDTH,
            clipHeight = PIECESPRITEWIDTH;

        ctx.drawImage(img, clipX, clipY, clipWidth, clipHeight, 
            xPos, yPos, cellWidth, cellWidth);
    }

    getCoord() {
        if(this._cell != null)
            return this._cell.getCoord();

        return "";
    }

    getPieceType() {
        return CAPITALIZE(GETENUMKEY(PIECETYPE, this.type));
    }

    getSide() {
        return CAPITALIZE(GETENUMKEY(SIDE, this.side));
    }

    move(cell: Cell) {
        // check if I can be moved to this cell...
        if(cell instanceof Cell && this.possibleMoves.includes(cell.getCoord())) {
            if(this._cell != null) 
                this._cell.piece = null;
            
            this._cell = cell;
            this._cell.piece = this;
            this.possibleMoves = [];

            return true;
        }

        return false;
    }
}