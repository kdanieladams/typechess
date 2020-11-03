import { SIDE } from '../globals.js';
import { Piece } from './pieces/_piece.js';

/**
 * Turn
 * 
 * Half-turn or action of one team (white OR black).
 */
export class Turn {
    capture: any = null;
    endCoord: string = '';
    movedPiece: Piece = null;
    side: SIDE = null;
    startCoord: string = '';
    msgs: string[] = new Array();
    castleRookId: string = null;
    
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
