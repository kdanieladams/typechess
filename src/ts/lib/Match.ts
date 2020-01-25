import { FILE, PIECETYPE, SIDE } from '../globals';
import { Board } from './Board';
import { Cell } from './Cell';
import { ChessAi } from './ChessAi';
import { Piece } from './pieces/_Piece';
import { Team } from './Team';
import { Turn } from './Turn';
import { King } from './pieces/King';
import { Rook } from './pieces/Rook';
import { ChessUi } from './ui/ChessUi';
import { Pawn } from './pieces/Pawn';
import { Knight } from './pieces/Knight';
import { Bishop } from './pieces/Bishop';
import { Queen } from './pieces/Queen';

/**
 * Match
 */
export class Match {
    ai: ChessAi;
    ui: ChessUi;
    board: Board;
    checkmate: boolean = false;
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
            this.ai = new ChessAi(this.board);
            this.ui = new ChessUi();

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

        if(!this.checkmate) {
            // select a piece to move
            if(cell && cell.isOccupied() && cell.piece.side == activeTeam.side) {
                let piece = cell.piece;

                this.clearPossible();
                activeTeam.activePiece = piece;
                piece.canMove(this.board);
                this.draw();
            }
            // move a piece to a possible cell
            else if(activeTeam.activePiece != null && cell.possibleMove) {
                
                this.startTurn(activeTeam.activePiece, cell);
                this.board.getCellByCoord(activeTeam.activePiece.getCoord()).piece = null;

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
                this.draw();
            }
            // click ui buttons
            else if(this.ui.clickedUndoBtn(event)) {
                this.undoMove();
            }
            else if(this.ui.clickedLoadBtn(event)) {
                this.load();
            }
            else if(this.ui.clickedResetBtn(event)) {
                this.reset();
            }
            else if(this.ui.clickedSaveBtn(event)) {
                this.save();
            }
            // de-select a piece to move
            else {
                this.clearPossible();
                this.draw();
            }
        }
        else if(this.ui.clickedResetBtn(event)) {
            this.reset();
        }
    }

    draw() {
        this.board.draw();
        this.ui.draw(this.board.ctx, 
            this.getWhiteTeam().getScore(), 
            this.getBlackTeam().getScore(),
            this.turns);
    }

    finishTurn() {
        let nextTeam = this.team1.side == this.whosTurn() ? this.team1 : this.team2;
        let prevTeam = nextTeam.side == this.team1.side ? this.team2 : this.team1;

        if(this.isTeamInCheck(prevTeam))
            this.checkmate = this.ai.detectCheckMate(prevTeam, nextTeam);
        if(this.isTeamInCheck(nextTeam) && !this.checkmate)
            this.checkmate = this.ai.detectCheckMate(nextTeam, prevTeam);

        if(!this.checkmate) {
            this.updateStatus("It\'s " + nextTeam.getSide() + "\'s turn.");
        }
        else {
            this.updateStatus("CHECKMATE!!! " + prevTeam.getSide() + " wins!");
            prevTeam.captures.push(nextTeam.pieces[15]);
            this.turns[this.turns.length - 1].captures.push(nextTeam.pieces[15]);
            nextTeam.pieces[15].captured = true;
        }
    }

    getBlackTeam() {
        return this.team1.side == SIDE.black ? this.team1 : this.team2;
    }

    getWhiteTeam() {
        return this.team1.side == SIDE.white ? this.team1 : this.team2;
    }

    isTeamInCheck(defTeam) {
        let kingCoord: string = defTeam.pieces[15].getCoord(),
            offTeam: Team = defTeam.side == SIDE.white ? this.getBlackTeam() : this.getWhiteTeam();

        if(this.ai.detectCheck(kingCoord, offTeam)) {
            this.updateStatus(defTeam.getSide() + "\'s king is in check!");
            defTeam.kingInCheck = true;
            return true;
        }
        else if(defTeam.kingInCheck == true) {
            this.updateStatus(defTeam.getSide() + "\'s king is no longer in check!");
            defTeam.kingInCheck = false;
        }

        return false;
    }

    load() {
        let saveGame = JSON.parse(window.localStorage.getItem("Typechess_Save"));
        let assignPieceProperties = (piece: Piece, i: number, teamObj: any) => {
            let pieceObj = teamObj.pieces[i];
            
            piece.captured = pieceObj.captured;
            if(!piece.captured) {
                piece.possibleMoves = [pieceObj._coord];
                piece.move(this.board.getCellByCoord(pieceObj._coord));
            }
            else {
                this.board.getCellByCoord(piece.getCoord()).piece = null;
            }
        }

        if(!saveGame) {
            alert('No save found!');
            return;
        }

        // reset match to start
        this.reset();
        
        // place pieces in last known position
        this.team1.pieces.forEach((piece, i) => {
            assignPieceProperties(piece, i, saveGame.team1);
        });
        this.team2.pieces.forEach((piece, i) => {
            assignPieceProperties(piece, i, saveGame.team2);
        });

        // update team captures
        if(saveGame.team1.captures && saveGame.team1.captures instanceof Array) {
            saveGame.team1.captures.forEach(capObj => {
                this.team1.captures.push(capObj);
            });
        }
        if(saveGame.team2.captures && saveGame.team2.captures instanceof Array) {
            saveGame.team2.captures.forEach(capObj => {
                this.team2.captures.push(capObj);
            });
        }

        // update turn collection
        if(saveGame.turns && saveGame.turns instanceof Array) {
            saveGame.turns.forEach(turnObj => {
                let piece: any = Object.assign({}, turnObj.movedPiece);
                piece.getCoord = () => { return piece._coord };
                let turn: Turn = new Turn(piece as Piece, turnObj.endCoord);
                turn.msgs = turnObj.msgs;
                this.turns.push(turn);
            });
        }

        // re-draw board and UI
        this.draw();
        alert('Game Loaded!');
    }

    reset() {
        this.constructor(new Board(this.board.canvas, this.board.pieces_img),
            new Team(SIDE.white),
            new Team(SIDE.black));
        this.draw();
    }

    save() {
        let currDate = new Date(),
            saveName = "Typechess_Save";

        window.localStorage.setItem(saveName, JSON.stringify({
            "team1" : this.team1,
            "team2" : this.team2,
            "turns" : this.turns
        }));
        alert("Game saved!");
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
        let activeTeam = piece.side == this.team1.side ? this.team1 : this.team2;
        let msg = activeTeam.getSide() + " moved " 
                + activeTeam.activePiece.getPieceType() + "("
                + activeTeam.activePiece.getCoord().toUpperCase() + ") to "
                + moveTo.getCoord().toUpperCase() + ".";
        
        this.turns.push(activeTurn);
        this.updateStatus(msg);

        // handle captures
        if(moveTo.isOccupied()) {
            let notActiveSide = activeTeam.side == this.team1.side ? this.team2.getSide() : this.team1.getSide();
            let msg2 = activeTeam.getSide() + " captured " 
                + notActiveSide + " " + moveTo.piece.getPieceType()
                + "(" + moveTo.getCoord().toUpperCase() + ") \+" + moveTo.piece.value + "pts.";
            let pieceCopy = null; 

            moveTo.piece.captured = true;
            pieceCopy = Object.assign({}, moveTo.piece);
            activeTurn.captures.push(pieceCopy);
            activeTeam.captures.push(pieceCopy);

            // this.updateCaptures(activeTeam);
            this.updateStatus(msg2);
        }
    }

    undoMove() {
        if(this.turns.length == 0)
            return;

        let latestTurn = this.turns[this.turns.length - 1];
        let piece = latestTurn.movedPiece;
        let capturedPiece = latestTurn.captures.length > 0 ? latestTurn.captures[latestTurn.captures.length - 1] : null;

        // move the piece to it's previous position
        this.board.getCellByCoord(piece.getCoord()).piece = null;
        piece.possibleMoves = [latestTurn.startCoord];
        piece.move(this.board.getCellByCoord(latestTurn.startCoord));

        // remove hasMoved where applicable
        if(piece.type == PIECETYPE.rook || piece.type == PIECETYPE.pawn || piece.type == PIECETYPE.king) {
            let p: Rook = piece as Rook;
            if(p.hasMoved != null && p.origCoord != null 
                && p.origCoord.includes(latestTurn.startCoord)) 
            {
                p.hasMoved = false;
            }
        }

        // replace any captured piece
        if(capturedPiece != null) {
            let capTeam = capturedPiece.side == SIDE.white ? this.getWhiteTeam() : this.getBlackTeam();
            let offTeam = capTeam == this.team1 ? this.team2 : this.team1;
            
            for(let i = 0; i < capTeam.pieces.length; i++) {
                let capPieceInst = capTeam.pieces[i];

                if(capPieceInst.captured 
                    && capPieceInst.type == capturedPiece.type
                    && capPieceInst.getCoord() == latestTurn.endCoord)
                {
                    capPieceInst.captured = false;
                    capPieceInst.possibleMoves = [latestTurn.endCoord];
                    capPieceInst.move(this.board.getCellByCoord(latestTurn.endCoord));
                    break;
                }
            }

            // remove captured pieces from Team.captured
            offTeam.captures.pop();
            // this.updateCaptures(offTeam);
        }

        // remove the action from the log
        this.turns.pop();

        // re-draw the board
        this.draw();
    }

    updateStatus(msg: string) {
        let latestTurn: Turn = this.turns[this.turns.length - 1];
        if(latestTurn != undefined)
            latestTurn.msgs.push(msg);
    }

    whosTurn() {
        return this.turns.length % 2 ? SIDE.black : SIDE.white;
    }
}
