import { PIECETYPE, SIDE } from '../../globals';
import { Piece } from './_Piece';
import { Board } from '../Board';

/**
 * Bishop
 */
export class Bishop extends Piece {
    value = 325;

    constructor(side: SIDE, id: number) {
        super(side, PIECETYPE.bishop, id);

        // init possible starting locations
        this.possibleMoves = [
            'c1', 'f1', 'c8', 'f8'
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

        return this.possibleMoves;
    }
}