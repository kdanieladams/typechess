import { Board } from './Board';
import { Cell } from './Cell';
import { King } from './pieces/King';
import { Pawn } from './pieces/Pawn';
import { Rook } from './pieces/Rook';
import { Piece } from './pieces/_Piece';
import { Team } from './Team';

export class ChessAi {
    board: Board;
    side: number;
    
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
                        kingCoord: string, 
                        hasMoved: boolean = false; 

                    if(piece instanceof Pawn || piece instanceof Rook || piece instanceof King)
                        hasMoved = piece.hasMoved;

                    piece.possibleMoves = [coord];
                    piece.move(endCell);
                    kingCoord = defTeam.pieces[15].getCoord();
                    
                    if(!this.detectCheck(kingCoord, offTeam))
                        checkMate = false;

                    endCell.piece = null;
                    piece.possibleMoves = [startCell.getCoord()];
                    piece.move(startCell);

                    if(piece instanceof Pawn || piece instanceof Rook || piece instanceof King)
                        piece.hasMoved = hasMoved;

                    if(origPiece != null)
                        endCell.piece = origPiece;

                    if(checkMate == false)
                        return checkMate;
                });
            }
        });

        return checkMate;
    }

    takeTurn(team: Team): Cell {
        if(this.side !== null) {
            let movingPieces: Array<Piece> = [],
                attackingPieces: Array<any> = [],
                rndIndex: number,
                moveTo: string;
            
            // determine piece to move
            team.pieces.forEach((piece, i) => {
                let moves: Array<string> = piece.canMove(this.board);
                if(moves.length > 0 && !piece.captured) {
                    movingPieces.push(piece);
                    moves.forEach((coord: string) => {
                        let cell: Cell = this.board.getCellByCoord(coord);
                        if(cell.isOccupied()) {
                            attackingPieces.push({
                                "piece": piece,
                                "coord": coord,
                                "value": cell.piece.value
                            });
                        }
                    });
                }
            });

            // determine move to make based on attack value
            if(attackingPieces.length > 0) {
                let move: any;

                attackingPieces.sort((a, b) => {
                    if(a.value > b.value) return -1;
                    if(a.value < b.value) return 1;
                    return 0;
                });
                
                move = attackingPieces[0];
                team.activePiece = move.piece;
                
                // trigger startTurn on match
                return this.board.getCellByCoord(move.coord);
            }
            
            // determine move to make randomly
            rndIndex = Math.floor(Math.random() * movingPieces.length);
            team.activePiece = movingPieces[rndIndex];

            rndIndex = Math.floor(Math.random() * team.activePiece.possibleMoves.length);
            moveTo = team.activePiece.possibleMoves[rndIndex];

            // trigger startTurn on match
            return this.board.getCellByCoord(moveTo);
        }
    }
}