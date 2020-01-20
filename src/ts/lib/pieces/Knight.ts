import { SIDE, PIECETYPE, FILE } from '../../globals';
import { Piece } from './_Piece';
import { Board } from '../Board';

/**
 * Knight
 */
export class Knight extends Piece {
    value = 325;

    constructor(side: SIDE) {
        super(side, PIECETYPE.knight);

        // init possible starting locations
        this.possibleMoves = [
            'g1', 'b1', 'g8', 'b8'
        ];
    }

    canMove(board: Board) {        
        var file = this._cell.file;
        var rank = this._cell.rank;
        var testMoves = new Array();
        
        this.active = true;
        this.possibleMoves = [];

        // 2 forward 1 left
        testMoves.push("" + FILE[file - 1] + (rank + this._forward + this._forward));
        // 2 forward 1 right
        testMoves.push("" + FILE[file + 1] + (rank + this._forward + this._forward));
        // 2 left 1 forward 
        testMoves.push("" + FILE[file - 2] + (rank + this._forward));
        // 2 right 1 forward
        testMoves.push("" + FILE[file + 2] + (rank + this._forward));

        // 2 backward 1 left
        testMoves.push("" + FILE[file - 1] + (rank - this._forward - this._forward));
        // 2 backward 1 right
        testMoves.push("" + FILE[file + 1] + (rank - this._forward - this._forward));
        // 2 left 1 backward
        testMoves.push("" + FILE[file - 2] + (rank - this._forward));
        // 2 right 1 backward
        testMoves.push("" + FILE[file + 2] + (rank - this._forward));

        for(let i = 0; i < testMoves.length; i++) {
            let testMove = testMoves[i];
            if(board.cellInBounds(testMove)) {
                let cell = board.getCellByCoord(testMove);
                if(!cell.isOccupied() || cell.piece.side != this.side) {
                    this.possibleMoves.push(testMove);
                    cell.possibleMove = true;
                }
            }
        }

        return this.possibleMoves;
    }
}
