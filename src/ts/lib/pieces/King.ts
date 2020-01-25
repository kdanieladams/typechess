import { FILE, PIECETYPE, SIDE } from '../../globals';
import { Board } from '../Board';
import { Piece } from './_Piece';
import { Rook } from './Rook';
import { Cell } from '../Cell';

/**
 * King
 */
export class King extends Piece {
    hasMoved = false;
    origCoord = [
        'e1', 'e8'
    ];
    value = 50000;

    constructor(side: SIDE, id: number) {
        super(side, PIECETYPE.king, id);

        // init possible starting locations
        this.possibleMoves = this.origCoord;
    }

    canMove(board: Board) {
        let file = this._coord[0];
        let rank = parseInt(this._coord[1]);
        let testMoves = new Array();

        this.possibleMoves = [];

        // can castle king-side?
        if(!this.hasMoved 
            && !board.getCellByCoord('f' + rank).isOccupied()
            && !board.getCellByCoord('g' + rank).isOccupied()
            && board.getCellByCoord('h' + rank).isOccupied()) 
        {
            let rook = board.getCellByCoord('h' + rank).piece as Rook;

            if(rook.type == PIECETYPE.rook && !rook.hasMoved) {
                let castleCell = board.getCellByCoord('g' + rank);
                
                castleCell.possibleMove = true;
                castleCell.castleable = true;
                this.possibleMoves.push(castleCell.getCoord());
            }
        }

        // can castle queen-size?
        if(!this.hasMoved 
            && !board.getCellByCoord('d' + rank).isOccupied()
            && !board.getCellByCoord('c' + rank).isOccupied()
            && !board.getCellByCoord('b' + rank).isOccupied()
            && board.getCellByCoord('a' + rank).isOccupied())
        {
            let rook = board.getCellByCoord('a' + rank).piece as Rook;

            if(rook.type == PIECETYPE.rook && !rook.hasMoved) {
                let castleCell = board.getCellByCoord('c' + rank);
                
                castleCell.possibleMove = true;
                castleCell.castleable = true;
                this.possibleMoves.push(castleCell.getCoord());
            }
        }

        // can move 1sq in any direction
        testMoves.push("" + FILE[FILE[file] + 1] + rank);
        testMoves.push("" + FILE[FILE[file] - 1] + rank);
        testMoves.push("" + file + (rank + 1));
        testMoves.push("" + file + (rank - 1));
        testMoves.push("" + FILE[FILE[file] + 1] + (rank + 1));
        testMoves.push("" + FILE[FILE[file] - 1] + (rank - 1));
        testMoves.push("" + FILE[FILE[file] - 1] + (rank + 1));
        testMoves.push("" + FILE[FILE[file] + 1] + (rank - 1));
        
        for(let i = 0; i < testMoves.length; i++) {
            let testMove = testMoves[i];

            if(board.cellInBounds(testMove)) {
                let cell = board.getCellByCoord(testMove);
                if(cell.isOccupied()) {
                    if(cell.piece.side != this.side) {
                        this.possibleMoves.push(testMove);
                        cell.possibleMove = true;
                    }

                    continue;
                }
                
                this.possibleMoves.push(testMove);
                cell.possibleMove = true;
            }
        }

        return this.possibleMoves;
    }

    castleMove(cell: Cell, board: Board){
        if(cell.castleable && !this.hasMoved) {
            let rookFile = cell.file == FILE.c ? 'a' : 'h';
            let rank = cell.rank;
            let rookDest = (cell.file == FILE.c ? 'd' : 'f') + rank;
            let rook = board.getCellByCoord(rookFile + rank).piece;

            rook.possibleMoves.push(rookDest);
            rook.move(board.getCellByCoord(rookDest));
        }

        this.move(cell);
    }

    move(cell: Cell) {
        if(super.move(cell)) {
            if(cell.file != FILE.e
                || (this.side == SIDE.black && cell.rank != 8)
                || (this.side == SIDE.white && cell.rank != 1)) 
            {
                // team can no longer castle
                this.hasMoved = true;
                return true;
            }
        }

        return false;
    }
}
