import { CAPITALIZE, SIDE } from '../globals';
import { Bishop } from './pieces/Bishop';
import { King } from './pieces/King';
import { Pawn } from './pieces/Pawn';
import { Piece } from './pieces/_Piece';
import { Knight } from './pieces/Knight';
import { Queen } from './pieces/Queen';
import { Rook } from './pieces/Rook';

export class Team {
    side: number;
    activePiece: Piece;
    captures: Piece[] = new Array();
    pieces: Piece[] = new Array();
    kingInCheck: boolean = false;

    constructor(side: number) {
        this.side = side == SIDE.white ? SIDE.white : SIDE.black;
        
        // pawns
        this.pieces.push(new Pawn(this.side, 0));   // 0
        this.pieces.push(new Pawn(this.side, 1));   // 1
        this.pieces.push(new Pawn(this.side, 2));   // 2
        this.pieces.push(new Pawn(this.side, 3));   // 3
        this.pieces.push(new Pawn(this.side, 4));   // 4
        this.pieces.push(new Pawn(this.side, 5));   // 5
        this.pieces.push(new Pawn(this.side, 6));   // 6
        this.pieces.push(new Pawn(this.side, 7));   // 7

        // rooks
        this.pieces.push(new Rook(this.side, 8));   // 8
        this.pieces.push(new Rook(this.side, 9));   // 9

        // knights
        this.pieces.push(new Knight(this.side, 10)); // 10
        this.pieces.push(new Knight(this.side, 11)); // 11

        // bishops
        this.pieces.push(new Bishop(this.side, 12)); // 12
        this.pieces.push(new Bishop(this.side, 13)); // 13

        // royalty
        this.pieces.push(new Queen(this.side, 14));  // 14
        this.pieces.push(new King(this.side, 15));   // 15
    }

    clearPossible() {
        this.activePiece = null;
        this.pieces.forEach(piece => {
            piece.active = false;
            piece.possibleMoves = [];
        });
    }

    getPieceById(id: number) {
        if(id >= 0 && id <= 15) {
            return this.pieces.find(piece => piece.getId() == id);
        }
    }

    getSide() {
        return CAPITALIZE(SIDE[this.side]);
    }

    getScore() {
        var score = 0;

        for(let i = 0; i < this.captures.length; i++) {
            let capture = this.captures[i];
            score += capture.value;
        }

        return score;
    }
}