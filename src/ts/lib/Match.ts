import { PIECETYPE, SIDE } from "../globals";
import { Cell } from "./Cell";
import { ChessAi } from "./ChessAi";
import { King } from "./pieces/King";
import { Piece } from "./pieces/_Piece";
import { Team } from "./Team";
import { Turn } from "./Turn";


export class Match {
    executeMoveCallback: Function;
    updateStatusCallback: Function;

    ai: ChessAi;
    checkmate: boolean = false;
    team1: Team;
    team2: Team;
    turns: Turn[] = new Array();
    ai_engaged: boolean = false;
    
    constructor(team1: Team, team2: Team, ai: ChessAi) {
        this.ai = ai;
        this.team1 = team1;
        this.team2 = team2;
    }

    private _executeMove(activeTeam: Team, cell: Cell) {
        if(typeof(this.executeMoveCallback) == 'function')
            return this.executeMoveCallback(activeTeam, cell);
        
        return false;
    }

    private _updateStatus(msg: string) {
        if(typeof(this.updateStatusCallback) == 'function')
            return this.updateStatusCallback(msg);
        
        return false;
    }

    clearPossible() {
        this.team1.clearPossible();
        this.team2.clearPossible();
    }

    finishTurn() {
        let nextTeam = this.team1.side == this.whosTurn() ? this.team1 : this.team2;
        let prevTeam = nextTeam.side == this.team1.side ? this.team2 : this.team1;

        if(this.isTeamInCheck(prevTeam, true)) {     
            return false;
        }
        else if(this.isTeamInCheck(nextTeam, true) && !this.checkmate) {
            this.checkmate = this.ai.detectCheckMate(nextTeam, prevTeam);
            
            if(this.checkmate) {
                let capturedKing: King = nextTeam.getPieceByType(PIECETYPE.king) as King;
                this._updateStatus("CHECKMATE!!! " + prevTeam.getSide() + " wins!");
                capturedKing.captured = true;
                prevTeam.captures.push(capturedKing);

                return true;
            }
        }

        // if this is an ai game, trigger the ai turn...
        if(this.ai_engaged && this.whosTurn() == this.ai.side) {
            let aiTeam: Team = this.ai.side == SIDE.white ? this.getWhiteTeam() : this.getBlackTeam(),
                moveTo: Cell = this.ai.takeTurn(aiTeam);

            return this._executeMove(aiTeam, moveTo);
        }

        return true;
    }

    getBlackTeam() {
        return this.team1.side == SIDE.black ? this.team1 : this.team2;
    }

    getWhiteTeam() {
        return this.team1.side == SIDE.white ? this.team1 : this.team2;
    }

    isTeamInCheck(defTeam: Team, sendMsgs: boolean = false) {
        let kingCoord: string = defTeam.pieces[15].getCoord(),
            offTeam: Team = defTeam.side == SIDE.white ? this.getBlackTeam() : this.getWhiteTeam();

        if(this.ai.detectCheck(kingCoord, offTeam)) {
            if(sendMsgs)
                this._updateStatus(defTeam.getSide() + "\'s king is in check!");
            
            defTeam.kingInCheck = true;
            return true;
        }
        else if(defTeam.kingInCheck == true) {
            if(sendMsgs)
                this._updateStatus(defTeam.getSide() + "\'s king is no longer in check!");
            
            defTeam.kingInCheck = false;
        }

        return false;
    }

    startTurn(piece: Piece, moveTo: Cell) {
        let activeTurn = new Turn(piece, moveTo.getCoord());
        let activeTeam = piece.side == this.team1.side ? this.team1 : this.team2;
        let msg = activeTeam.getSide() + " moved " 
                + activeTeam.activePiece.getPieceType() + "("
                + activeTeam.activePiece.getCoord().toUpperCase() + ") to "
                + moveTo.getCoord().toUpperCase() + ".";
        
        this.turns.push(activeTurn);
        this._updateStatus(msg);

        // handle captures
        if(moveTo.isOccupied()) {
            let notActiveSide = activeTeam.side == this.team1.side ? this.team2.getSide() : this.team1.getSide();
            let msg2 = activeTeam.getSide() + " captured " 
                + notActiveSide + " " + moveTo.piece.getPieceType()
                + "(" + moveTo.getCoord().toUpperCase() + ") \+" + moveTo.piece.value + "pts.";
            let pieceCopy = null; 

            moveTo.piece.captured = true;
            pieceCopy = Object.assign({}, moveTo.piece);
            activeTurn.capture = pieceCopy;
            activeTeam.captures.push(pieceCopy);
            this._updateStatus(msg2);
        }
    }

    whosTurn() {
        return this.turns.length % 2 ? SIDE.black : SIDE.white;
    }
}
