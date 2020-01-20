import { SIDE } from '../globals';
import { Piece } from './pieces/_Piece';

export class Team {
    side: number;
    activePiece: Piece;
    captures: Piece[];
    pieces: Piece[];
    kingInCheck: boolean = false;

    constructor(side: number) {
        this.side = side == SIDE.white ? SIDE.white : SIDE.black;
    }

    clearPossible() {
        this.activePiece = null;
        this.pieces.forEach(piece => {
            piece.active = false;
        });
    }
}