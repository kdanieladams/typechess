import { FILE, PIECETYPE, SAVEGAMEPREFIX, SIDE } from '../globals';
import { Board } from './Board';
import { ChessAi } from './ChessAi';
import { ChessUi } from './ui/ChessUi';
import { King } from './pieces/King';
import { Piece } from './pieces/_Piece';
import { Match } from './Match';
import { Modal } from './ui/Modal';
import { Rook } from './pieces/Rook';
import { SaveGame } from './ui/SaveGame';
import { Team } from './Team';
import { Turn } from './Turn';
import { Cell } from './Cell';


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
        this.ai = new ChessAi(this.board, (aiTeam, moveTo) => { return this.executeMove(aiTeam, moveTo); });
        this.match = new Match(new Team(SIDE.white), new Team(SIDE.black), this.ai);
        this.ui = new ChessUi(ui_div);

        this.match.updateStatusCallback = (msg: string) => { return this.updateStatus(msg); };

        this.setupPieces(this.match.team1);
        this.setupPieces(this.match.team2);
        
        this.ui.callback_load = (savedGame) => { return this.loadGame(savedGame); };
        this.ui.callback_reset = (e) => { return this.reset(); };
        this.ui.callback_save = (saveName) => { return this.saveGame(saveName); };
        this.ui.callback_undo = (e) => { return this.undoMove(); };
        this.ui.callback_engage_ai = (side: number, disengage: boolean = false) => { return this.engageAi(side, disengage); };

        return this;
    }

    clearPossible() {
        this.board.clearPossible();
        this.match.clearPossible();
    }

    click(event: MouseEvent) {
        let cell: Cell = this.board.getCellByPixels(event.offsetX, event.offsetY);
        let activeTeam: Team = this.match.team1.side == this.match.whosTurn() ? this.match.team1 : this.match.team2;

        if(!this.match.checkmate) {
            // do nothing if it's the ai's turn
            if(this.match.ai_engaged && activeTeam.side == this.ai.side)
                return;

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
                this.executeMove(activeTeam, cell);
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

    engageAi(sideNum: number, disengage: boolean = false) {
        let side: string = SIDE[sideNum];

        if(!disengage) {
            let aiTeam: Team = side == SIDE[SIDE.black] ? this.match.getBlackTeam() : this.match.getWhiteTeam();
            this.ai.side = aiTeam.side;
            this.match.ai_engaged = true;
            
            if(this.ai.side == this.match.whosTurn()) {
                this.ai.takeTurn(aiTeam);
            }
        }
        else {
            this.ai.side = null;
            this.match.ai_engaged = false;
            // console.log("ai disengaged");
        }
    }

    executeMove(activeTeam: Team, cell: Cell): boolean {
        let turnSuccess = false;

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

        turnSuccess = this.match.finishTurn();
        if(!turnSuccess) {
            this.undoMove();
            // we're assuming the only move you can't really make is to put you're own king in check
            this.updateStatus(activeTeam.getSide() + " tried to sacrifice their king!");
            return false;
        }
        
        this.clearPossible();
        this.draw();
        return true;
    }

    loadGame(savedGame: SaveGame) {
        // let saveGame = JSON.parse(window.localStorage.getItem("Typechess_Save"));
        let modalTitle: string = "Load Game";
        let assignPieceProperties = (piece: Piece, i: number, teamObj: any) => {
            let pieceObj = teamObj.pieces[i];
            let cell = this.board.getCellByCoord(piece.getCoord());
            
            piece.captured = pieceObj.captured;
            cell.piece = null; 
            
            if(!piece.captured) {
                piece.possibleMoves = [pieceObj._coord];
                piece.move(this.board.getCellByCoord(pieceObj._coord));
            }
        }

        if(!savedGame) {
            (new Modal(modalTitle, "ERROR: Game not found!", [false, true], true)).show();
            return;
        }

        // reset match to start
        this.reset();
        
        // place pieces in last known position
        this.match.team1.pieces.forEach((piece, i) => {
            assignPieceProperties(piece, i, savedGame.team1);
        });
        this.match.team2.pieces.forEach((piece, i) => {
            assignPieceProperties(piece, i, savedGame.team2);
        });

        // update team captures
        if(savedGame.team1.captures && savedGame.team1.captures instanceof Array) {
            savedGame.team1.captures.forEach(capObj => {
                this.match.team1.captures.push(capObj);
            });
        }
        if(savedGame.team2.captures && savedGame.team2.captures instanceof Array) {
            savedGame.team2.captures.forEach(capObj => {
                this.match.team2.captures.push(capObj);
            });
        }

        // update turn collection
        if(savedGame.turns && savedGame.turns instanceof Array) {
            savedGame.turns.forEach(turnObj => {
                // let team = turnObj.side == SIDE.white ? this.match.getWhiteTeam() : this.match.getBlackTeam();
                let team = savedGame.getTeam(turnObj.side);
                let movedPiece = turnObj.movedPiece as any;
                let piece = team.getPieceById(movedPiece._id) || team.pieces[movedPiece._id];
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
        (new Modal(modalTitle, "\"" + savedGame.name + "\" loaded successfully!")).show();
    }

    reset() {
        this.constructor(this.board.canvas, this.board.pieces_img, this.ui.getUiDiv());
        this.draw();
    }

    saveGame(name: string) {
        let confirmModal: Modal = new Modal();
        confirmModal.title = "Save Game"

        if(name.length > 0) {
            let saveGame = new SaveGame(name, this.match.team1, this.match.team2, this.match.turns);            
            window.localStorage.setItem(SAVEGAMEPREFIX + "_" + name, JSON.stringify(saveGame));
            confirmModal.message = "Game successfully saved as \"" + name + "\"!";
            confirmModal.show();
        }
        else {
            confirmModal = new Modal(confirmModal.title, "ERROR! You must enter a save name!  Please try again.", [false, true], true);
            confirmModal.show();
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
