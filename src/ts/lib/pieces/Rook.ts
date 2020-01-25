import { FILE, PIECETYPE, SIDE } from '../../globals';
import { Board } from '../Board';
import { Piece } from './_Piece';

/**
 * Rook
 */
export class Rook extends Piece {
    hasMoved = false;
    origCoord = [
        'a1', 'h1', 'a8', 'h8'
    ];
    value = 550;

    constructor(side: SIDE, id: number) {
        super(side, PIECETYPE.rook, id);

        // init possible starting locations
        this.possibleMoves = this.origCoord;
    }

    canMove(board: Board) {
        this.active = true;
        this.possibleMoves = [];

        // can slide up-down-left-right until end of board
        this.possibleMoves = this.possibleMoves.concat(
            this.getPerpMoves(board, true, true),   // vertical up
            this.getPerpMoves(board, true, false),  // vertical down
            this.getPerpMoves(board, false, true),  // horizontal right
            this.getPerpMoves(board, false, false)  // horizontal left
        );
        
        return this.possibleMoves;
    }

    move(cell) {
        if(super.move(cell)) {
            if((cell.file != FILE.a && cell.file != FILE.h)
                || (this.side == SIDE.black && cell.rank != 8)
                || (this.side == SIDE.white && cell.rank != 1)) 
            {
                // team can no longer castle on this side
                this.hasMoved = true;
            }
        }

        return false;
    }
}
