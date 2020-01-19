import { SIDE } from '../globals.js';
import { Piece } from './pieces/_piece.js';

/**
 * Turn
 * 
 * Half-turn or action of one team (white OR black).
 */
export class Turn {
    captures = new Array();
    endCoord = '';
    movedPiece: Piece = null;
    side: SIDE = null;
    startCoord = '';
    
    constructor(piece: Piece, moveTo: string) {
        if(moveTo.length == 2) {
            this.movedPiece = piece;
            this.side = this.movedPiece.side;
            this.startCoord = this.movedPiece.getCoord();
            this.endCoord = moveTo;

            return this;
        }

        return null;
    }
}
