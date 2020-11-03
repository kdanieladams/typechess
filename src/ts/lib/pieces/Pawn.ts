import { SIDE, PIECETYPE, FILE } from '../../globals';
import { Board } from '../Board';
import { Cell } from '../Cell';
import { Piece } from './_Piece';

/**
 * Pawn
 * 
 * Contains properties and methods specific to a pawn.
 */
export class Pawn extends Piece {
    hasMoved = false;
    origCoord = [
        'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
        'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
    ];
    value = 100;

    constructor(side: SIDE) {
        super(side, PIECETYPE.pawn);

        // init possible starting locations
        this.possibleMoves = this.origCoord;
    }

    canMove(board: Board) {
        let file = this.getCoord()[0];
        let rank = parseInt(this.getCoord()[1]);

        this.active = true;
        this.possibleMoves = [];

        // can always move forward 1 sq
        let mv1sq = "" + file + (rank + this._forward);
        let cell1 = board.getCellByCoord(mv1sq);
        if(board.cellInBounds(mv1sq) && !cell1.isOccupied()) {
            this.possibleMoves.push(mv1sq);
        }

        // on first move, can move 2 sqs
        let mv2sq = "" + file + (rank + this._forward + this._forward);
        let cell2 = board.getCellByCoord(mv2sq);
        if(!this.hasMoved && board.cellInBounds(mv2sq)
            && !cell2.isOccupied() && !cell1.isOccupied())
        {
            this.possibleMoves.push(mv2sq);
        }

        // can only attack diagonally
        let oppSide = this.side == SIDE.white ? SIDE.black : SIDE.white;
        let diagL = "" + FILE[(FILE[file] - 1)] + (rank + this._forward);
        if(board.cellInBounds(diagL)) {
            let cell = board.getCellByCoord(diagL);
            if(cell.isOccupied() && cell.piece.side == oppSide) {
                this.possibleMoves.push(diagL);
            }
        }

        let diagR = "" + FILE[(FILE[file] + 1)] + (rank + this._forward);
        if(board.cellInBounds(diagR)) {
            let cell = board.getCellByCoord(diagR);
            if(cell.isOccupied() && cell.piece.side == oppSide) {
                this.possibleMoves.push(diagR);
            }
        }

        // highlight possible moves on the board
        this.possibleMoves.forEach(coord => {
            let cell = board.getCellByCoord(coord);
            cell.possibleMove = true;
        });

        return this.possibleMoves;
    }

    move(cell: Cell) {
        if(super.move(cell)) {
            this.hasMoved = true;
            return true;
        }

        return false;
    }
}
