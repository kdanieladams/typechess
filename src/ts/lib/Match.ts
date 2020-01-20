import { FILE, PIECETYPE, SIDE } from '../globals';
import { Board } from './Board';
import { Cell } from './Cell';
import { Piece } from './pieces/_Piece';
import { Team } from './Team';
import { Turn } from './Turn';
import { King } from './pieces/King';

/**
 * Match
 */
export class Match {
    board: Board;
    team1: Team;
    team2: Team;
    turns: Turn[] = new Array();

    constructor(board: Board, team1: Team, team2: Team) {
        if(team1.side != team2.side) {
            this.board = board;
            this.team1 = team1;
            this.team2 = team2;

            this.setupPieces(this.team1);
            this.setupPieces(this.team2);

            return this;
        }

        console.error("Match.constructor: teams must be on different sides.");
        return null;
    }

    clearPossible() {
        this.board.clearPossible();
        this.team1.clearPossible();
        this.team2.clearPossible();
    }

    click(event: MouseEvent) {
        let cell = this.board.getCellByPixels(event.offsetX, event.offsetY);
        let activeTeam = this.team1.side == this.whosTurn() ? this.team1 : this.team2;

        // select a piece to move
        if(cell.isOccupied() && cell.piece.side == activeTeam.side) {
            let piece = cell.piece;

            this.clearPossible();
            activeTeam.activePiece = piece;
            piece.canMove(this.board);
            this.board.draw();
        }
        // move a piece to a possible cell
        else if(activeTeam.activePiece != null && cell.possibleMove) {
            let msg = activeTeam.getSide() + " moves " 
                + activeTeam.activePiece.getPieceType() + "("
                + activeTeam.activePiece.getCoord().toUpperCase() + ") to "
                + cell.getCoord().toUpperCase() + ".";
            
            this.updateStatus(msg);
            this.startTurn(activeTeam.activePiece, cell);

            if(activeTeam.activePiece.type == PIECETYPE.king) 
            {
                let king = activeTeam.activePiece as King;
                king.castleMove(cell, this.board);
            }
            else {
                activeTeam.activePiece.move(cell);
            }

            this.finishTurn();
            this.clearPossible();
            this.board.draw();
        }
        // de-select a piece to move
        else {
            this.clearPossible();
            this.board.draw();
        }
    }

    finishTurn() {
        // ...
    }

    setupPieces(team: Team) {
        let filesArr = Object.keys(FILE),
            pawnRank = team.side == SIDE.white ? "2" : "7",
            rank = team.side == SIDE.white ? '1' : '8';

        team.pieces.forEach((piece, i) => {
            let coord: string = '';
            
            // pawns
            if(i < filesArr.length && piece.type == PIECETYPE.pawn)
                coord = filesArr[i + (filesArr.length / 2)] + pawnRank;
            // rooks
            else if(i == 8) coord = "a" + rank;
            else if(i == 9) coord = "h" + rank;
            // knights
            else if(i == 10) coord = "b" + rank;
            else if(i == 11) coord = "g" + rank;
            // bishops
            else if(i == 12) coord = "c" + rank;
            else if(i == 13) coord = "f" + rank;
            // royalty
            else if(i == 14) coord = "d" + rank;
            else if(i == 15) coord = "e" + rank;

            piece.move(this.board.getCellByCoord(coord));
        });
    }

    startTurn(piece: Piece, moveTo: Cell) {
        let activeTurn = new Turn(piece, moveTo.getCoord());

        // handle captures
        if(moveTo.isOccupied()) {
            let activeTeam = this.whosTurn() == this.team1.side ? this.team1 : this.team2;
            let notActiveSide = activeTeam.side == this.team1.side ? this.team2.getSide() : this.team1.getSide();
            let msg = activeTeam.getSide() + " captures " 
                + notActiveSide + " " + moveTo.piece.getPieceType()
                + "(" + moveTo.getCoord().toUpperCase() + ") \+" + moveTo.piece.value + "pts.";
            let pieceCopy = null; 

            moveTo.piece.captured = true;
            pieceCopy = Object.assign({}, moveTo.piece);
            activeTurn.captures.push(pieceCopy);
            activeTeam.captures.push(pieceCopy);

            // this.updateCaptures(activeTeam);
            // this.updateStatus(msg);
            // this.updateScore();
        }

        this.turns.push(activeTurn);
    }

    updateStatus(msg: string) {
        // ...
    }

    whosTurn() {
        return this.turns.length % 2 ? SIDE.black : SIDE.white;
    }
}
