import { PIECETYPE, SIDE } from '../../globals';
import { Board } from '../Board';
import { Piece } from './_Piece';

/**
 * Queen
 */
export class Queen extends Piece {
    value = 1000;

    constructor(side: SIDE, id: number) {
        super(side, PIECETYPE.queen, id);

        // init possible starting locations
        this.possibleMoves = [
            'd1', 'd8'
        ];
    }

    canMove(board: Board) {
        this.active = true;
        this.possibleMoves = [];

        // can slide diagonally            
        this.possibleMoves = this.possibleMoves.concat(
            this.getDiagMoves(board, true, false),  // forward and left
            this.getDiagMoves(board, true, true),   // forward and right
            this.getDiagMoves(board, false, false), // backward and left
            this.getDiagMoves(board, false, true)   // backward and right
        );

        // can slide up-down-left-right until end of board
        this.possibleMoves = this.possibleMoves.concat(
            this.getPerpMoves(board, true, true),   // vertical up
            this.getPerpMoves(board, true, false),  // vertical down
            this.getPerpMoves(board, false, true),  // horizontal right
            this.getPerpMoves(board, false, false)  // horizontal left
        );

        return this.possibleMoves;
    }
}
