import { CAPITALIZE, PIECETYPE, SIDE } from '../globals';
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
        this.pieces.push(new Pawn(this.side)); 
        this.pieces.push(new Pawn(this.side)); 
        this.pieces.push(new Pawn(this.side)); 
        this.pieces.push(new Pawn(this.side)); 
        this.pieces.push(new Pawn(this.side)); 
        this.pieces.push(new Pawn(this.side)); 
        this.pieces.push(new Pawn(this.side)); 
        this.pieces.push(new Pawn(this.side)); 

        // rooks
        this.pieces.push(new Rook(this.side)); 
        this.pieces.push(new Rook(this.side)); 

        // knights
        this.pieces.push(new Knight(this.side));
        this.pieces.push(new Knight(this.side));

        // bishops
        this.pieces.push(new Bishop(this.side));
        this.pieces.push(new Bishop(this.side));

        // royalty
        this.pieces.push(new Queen(this.side)); 
        this.pieces.push(new King(this.side));  
    }

    clearPossible(): void {
        this.activePiece = null;
        this.pieces.forEach(piece => {
            piece.active = false;
            piece.possibleMoves = [];
        });
    }

    getPieceById(id: string): Piece {
        return this.pieces.find(piece => piece.getId() == id);
    }

    getPieceByType(type: number): Piece {
        return this.pieces.find(piece => piece.type == type);
    }

    getSide(): string {
        return CAPITALIZE(SIDE[this.side]);
    }

    getScore(): number {
        var score = 0;

        for(let i = 0; i < this.captures.length; i++) {
            let capture = this.captures[i];
            score += capture.value;
        }

        return score;
    }

    createNewPiece(pieceObj): Piece {
        let newPiece: Piece;

        if(pieceObj) {
            switch(pieceObj.type) {
                case PIECETYPE.pawn: 
                    newPiece = new Pawn(this.side); 
                    break;
                case PIECETYPE.rook:
                    newPiece = new Rook(this.side); 
                    break;
                case PIECETYPE.knight:
                    newPiece = new Knight(this.side); 
                    break;
                case PIECETYPE.bishop:
                    newPiece = new Bishop(this.side); 
                    break;
                case PIECETYPE.queen:
                    newPiece = new Queen(this.side); 
                    break;
                case PIECETYPE.king:
                    newPiece = new King(this.side); 
                    break;
            }
        }

        return newPiece;
    }

    translateFromJson(teamObj): Team {
        Object.assign(this, teamObj);
        
        this.activePiece = null;
        this.activePiece = this.createNewPiece(teamObj.activePiece);

        this.pieces = [];
        teamObj.pieces.forEach(pieceObj => {
            let newPiece : Piece = this.createNewPiece(pieceObj);
            newPiece = newPiece.translateFromJson(pieceObj);
            this.pieces.push(newPiece);
        });

        this.captures = [];
        teamObj.captures.forEach(pieceObj => {
            let capturedPiece : Piece = this.createNewPiece(pieceObj);
            capturedPiece = capturedPiece.translateFromJson(pieceObj);
            this.captures.push(capturedPiece);
        });
        
        return this;
    }
}