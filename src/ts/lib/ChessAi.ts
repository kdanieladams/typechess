import { Board } from './Board';
import { Cell } from './Cell';
import { Piece } from './pieces/_Piece';
import { Team } from './Team';

export class ChessAi {
    board: Board;
    
    constructor(board: Board) {
        this.board = board;
    }

    detectCheck(kingCoord: string, assaultTeam: Team) {
        for(let i = 0; i < assaultTeam.pieces.length; i ++){
            let piece: Piece = assaultTeam.pieces[i];
            if(!piece.captured) {
                piece.canMove(this.board);
                if(piece.possibleMoves.includes(kingCoord)) {
                    return true;
                }
            }
        }

        return false;
    }

    detectCheckMate(defTeam: Team, offTeam: Team) {
        let checkMate: boolean = true;

        defTeam.pieces.forEach(piece => {
            let coords: string[] = new Array(),
                startCell: Cell = this.board.getCellByCoord(piece.getCoord());
            
            if(!piece.captured) {
                coords = piece.canMove(this.board);
                coords.forEach(coord => {
                    let endCell: Cell = this.board.getCellByCoord(coord),
                        origPiece: Piece = endCell.piece,
                        kingCoord: string; 
                    
                    piece.possibleMoves = [coord];
                    piece.move(endCell);
                    kingCoord = defTeam.pieces[15].getCoord();
                    
                    if(!this.detectCheck(kingCoord, offTeam)) {
                        checkMate = false;
                    }

                    endCell.piece = null;
                    piece.possibleMoves = [startCell.getCoord()];
                    piece.move(startCell);

                    if(origPiece != null) {
                        endCell.piece = origPiece;
                    }
                });
            }
        });

        return checkMate;
    }
}