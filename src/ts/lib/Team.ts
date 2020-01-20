import { SIDE } from '../globals';
import { Piece } from './pieces/_Piece';
import { Pawn } from './pieces/Pawn';
import { Rook } from './pieces/Rook';
import { Knight } from './pieces/Knight';
import { Bishop } from './pieces/Bishop';
import { King } from './pieces/King';
import { Queen } from './pieces/Queen';

export class Team {
    side: number;
    activePiece: Piece;
    captures: Piece[] = new Array();
    pieces: Piece[] = new Array();
    kingInCheck: boolean = false;

    constructor(side: number) {
        this.side = side == SIDE.white ? SIDE.white : SIDE.black;
        
        // pawns
        this.pieces.push(new Pawn(this.side));   // 0
        this.pieces.push(new Pawn(this.side));   // 1
        this.pieces.push(new Pawn(this.side));   // 2
        this.pieces.push(new Pawn(this.side));   // 3
        this.pieces.push(new Pawn(this.side));   // 4
        this.pieces.push(new Pawn(this.side));   // 5
        this.pieces.push(new Pawn(this.side));   // 6
        this.pieces.push(new Pawn(this.side));   // 7

        // rooks
        this.pieces.push(new Rook(this.side));   // 8
        this.pieces.push(new Rook(this.side));   // 9

        // knights
        this.pieces.push(new Knight(this.side)); // 10
        this.pieces.push(new Knight(this.side)); // 11

        // bishops
        this.pieces.push(new Bishop(this.side)); // 12
        this.pieces.push(new Bishop(this.side)); // 13

        // royalty
        this.pieces.push(new Queen(this.side));  // 14
        this.pieces.push(new King(this.side));   // 15
    }

    clearPossible() {
        this.activePiece = null;
        this.pieces.forEach(piece => {
            piece.active = false;
        });
    }
}