import { FILE, PIECETYPE, SIDE } from '../globals';
import { Board } from './Board';
import { ChessAi } from './ChessAi';
import { ChessUi } from './ui/ChessUi';
import { King } from './pieces/King';
import { Piece } from './pieces/_Piece';
import { Match } from './Match';
import { Rook } from './pieces/Rook';
import { Team } from './Team';
import { Turn } from './Turn';


/**
 * Typechess
 * ---------
 * Simple chess engine written in TypeScript.
 */
export class Typechess {
    ai: ChessAi;
    ui: ChessUi;
    board: Board;
    match: Match;

    constructor(canvas: HTMLCanvasElement, pieces_img: HTMLImageElement, ui_div: HTMLDivElement) {
        this.board = new Board(canvas, pieces_img);
        this.ai = new ChessAi(this.board);
        this.ui = new ChessUi(ui_div);
        this.match = new Match(new Team(SIDE.white), new Team(SIDE.black), this.ai);

        this.match.updateStatusCallback = (msg: string) => { return this.updateStatus(msg); };

        this.setupPieces(this.match.team1);
        this.setupPieces(this.match.team2);
        
        this.ui.callback_load = (e) => { return this.load(); };
        this.ui.callback_reset = (e) => { return this.reset(); };
        this.ui.callback_save = (e) => { return this.save(); };
        this.ui.callback_undo = (e) => { return this.undoMove(); };

        return this;
    }

    clearPossible() {
        this.board.clearPossible();
        this.match.clearPossible();
    }

    click(event: MouseEvent) {
        let cell = this.board.getCellByPixels(event.offsetX, event.offsetY);
        let activeTeam = this.match.team1.side == this.match.whosTurn() ? this.match.team1 : this.match.team2;

        if(!this.match.checkmate) {
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
                
                this.match.startTurn(activeTeam.activePiece, cell);
                this.board.getCellByCoord(activeTeam.activePiece.getCoord()).piece = null;

                if(activeTeam.activePiece.type == PIECETYPE.king) 
                {
                    let king = activeTeam.activePiece as King;
                    let latestTurn = this.match.turns[this.match.turns.length - 1];

                    latestTurn.castleRookId = king.castleMove(cell, this.board);;
                }
                else {
                    activeTeam.activePiece.move(cell);
                }

                this.match.finishTurn();
                this.clearPossible();
                this.draw();
            }
            // de-select a piece to move
            else {
                this.clearPossible();
                this.draw();
            }
        }
    }

    draw() {
        this.board.draw();
        this.ui.draw(this.match.getWhiteTeam().getScore(), 
            this.match.getBlackTeam().getScore(),
            this.match.turns);
    }

    load() {
        let saveGame = JSON.parse(window.localStorage.getItem("Typechess_Save"));
        let assignPieceProperties = (piece: Piece, i: number, teamObj: any) => {
            let pieceObj = teamObj.pieces[i];
            let cell = this.board.getCellByCoord(piece.getCoord());
            
            piece.captured = pieceObj.captured;
            cell.piece = cell.piece == piece ? null : cell.piece;
            
            if(!piece.captured) {
                piece.possibleMoves = [pieceObj._coord];
                piece.move(this.board.getCellByCoord(pieceObj._coord));
            }
        }

        if(!saveGame) {
            alert('No save found!');
            return;
        }

        // reset match to start
        this.reset();
        
        // place pieces in last known position
        this.match.team1.pieces.forEach((piece, i) => {
            assignPieceProperties(piece, i, saveGame.team1);
        });
        this.match.team2.pieces.forEach((piece, i) => {
            assignPieceProperties(piece, i, saveGame.team2);
        });

        // update team captures
        if(saveGame.team1.captures && saveGame.team1.captures instanceof Array) {
            saveGame.team1.captures.forEach(capObj => {
                this.match.team1.captures.push(capObj);
            });
        }
        if(saveGame.team2.captures && saveGame.team2.captures instanceof Array) {
            saveGame.team2.captures.forEach(capObj => {
                this.match.team2.captures.push(capObj);
            });
        }

        // update turn collection
        if(saveGame.turns && saveGame.turns instanceof Array) {
            saveGame.turns.forEach(turnObj => {
                let team = turnObj.side == SIDE.white ? this.match.getWhiteTeam() : this.match.getBlackTeam();
                let piece = team.getPieceById(turnObj.movedPiece._id);
                let startCoord = piece.getCoord();
                let turn: Turn;

                piece.overrideCoord(turnObj.startCoord);
                turn = new Turn(piece, turnObj.endCoord);
                piece.overrideCoord(startCoord);
                turn.msgs = turnObj.msgs;
                turn.capture = turnObj.capture;
                turn.castleRookId = turnObj.castleRookId;
                this.match.turns.push(turn);
            });
        }

        // re-draw board and UI
        this.draw();
        alert('Game Loaded!');
    }

    reset() {
        this.constructor(this.board.canvas, this.board.pieces_img, this.ui.getUiDiv());
        this.draw();
    }

    save() {
        let currDate = new Date(),
            saveName = "Typechess_Save";

        if(confirm("Are you sure you want to save the current game?")) {
            window.localStorage.setItem(saveName, JSON.stringify({
                "team1" : this.match.team1,
                "team2" : this.match.team2,
                "turns" : this.match.turns
            }));
            alert("Game saved!");
        }
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

    undoMove() {
        if(this.match.turns.length == 0)
            return;

        let latestTurn = this.match.turns[this.match.turns.length - 1];
        let piece = latestTurn.movedPiece;
        let capturedPiece = latestTurn.capture;
        let team = latestTurn.side == SIDE.white ? this.match.getWhiteTeam() : this.match.getBlackTeam();

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
            let offTeam = team;
            let defTeam = team.side == SIDE.white ? this.match.getBlackTeam() : this.match.getWhiteTeam();
            
            for(let i = 0; i < defTeam.pieces.length; i++) {
                let capPieceInst = defTeam.pieces[i];

                if(capPieceInst.captured && capPieceInst.getId() == capturedPiece._id)
                {
                    capPieceInst.captured = false;
                    capPieceInst.possibleMoves = [latestTurn.endCoord];
                    capPieceInst.move(this.board.getCellByCoord(latestTurn.endCoord));
                    break;
                }
            }

            if(this.match.checkmate) {
                // remove the defensive king from the offensive captures
                offTeam.captures.pop();
            }
            
            // remove captured pieces from Team.captured
            offTeam.captures.pop();
        }

        // undo rook castle
        if(latestTurn.castleRookId != null) {
            let rook: Rook = team.getPieceById(latestTurn.castleRookId) as Rook,
                rookFile = FILE[latestTurn.endCoord[1]] == FILE.c ? 'a' : 'h',
                newCoord = rook.getCoord(),
                rookRank = newCoord[1],
                oldCoord = rookFile + rookRank;

            rook.possibleMoves.push(oldCoord);
            rook.move(this.board.getCellByCoord(oldCoord));
            rook.hasMoved = false;
            this.board.getCellByCoord(newCoord).piece = null;
        }

        // remove the action from the log
        this.match.turns.pop();

        if(this.match.checkmate) 
            this.match.checkmate = false;

        // re-draw the board
        this.draw();
    }

    updateStatus(msg: string) {
        let latestTurn: Turn = this.match.turns[this.match.turns.length - 1];
        if(latestTurn != undefined)
            latestTurn.msgs.push(msg);
    }
}
