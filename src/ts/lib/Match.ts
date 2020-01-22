import { CANVASMARGIN, FILE, PIECETYPE, SIDE } from '../globals';
import { Board } from './Board';
import { Cell } from './Cell';
import { Piece } from './pieces/_Piece';
import { Team } from './Team';
import { Turn } from './Turn';
import { King } from './pieces/King';
import { Rook } from './pieces/Rook';

/**
 * Match
 */
export class Match {
    board: Board;
    team1: Team;
    team2: Team;
    turns: Turn[] = new Array();
    undoBtn: any = {
        width: 95,
        height: 35,
        x: CANVASMARGIN,
        y: 94
    };

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
        // click undo button 
        else if(event.offsetX >= this.undoBtn.x 
            && event.offsetX <= this.undoBtn.x + this.undoBtn.width
            && event.offsetY >= this.undoBtn.y
            && event.offsetY <= this.undoBtn.y + this.undoBtn.height) 
        {
            this.undoMove();
        }
        // de-select a piece to move
        else {
            this.clearPossible();
            this.draw();
        }
    }

    draw() {
        this.board.draw();
        this.drawUi();
    }

    drawUi() {
        // 170px by 640px = total UI area
        let score_x = 0 + CANVASMARGIN, 
            score_y = 15 + CANVASMARGIN,
            score_width = 200,
            status_x = score_width + CANVASMARGIN, 
            status_y = 15 + CANVASMARGIN,
            ui_height = 170,
            ctx: CanvasRenderingContext2D = this.board.ctx;

        // draw the score
        let scoreTxt = ['Score:',
            'White: ' + this.getWhiteTeam().getScore(),
            'Black: ' + this.getBlackTeam().getScore()
        ];
        let lineHeight = 25;
        
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px Raleway';
        scoreTxt.forEach((str, i) => {
            if(i > 0) ctx.font = '16px Raleway';
            if(i > 1) lineHeight = 23;
            ctx.fillText(str, score_x, score_y + (i * lineHeight), score_width);
        });
        ctx.closePath();

        // draw the last four status messages
        let statusMsgs: string[] = new Array();
        lineHeight = 25;

        for(let i = 0; i < 4; i++) {
            let turn: Turn = this.turns[this.turns.length - 1 - i];
            if(turn != undefined) {
                for(let j = 0; j < turn.msgs.length; j++) {
                    let msg = turn.msgs[turn.msgs.length - j - 1];
                    statusMsgs.push(msg);
                }
            }
            if(i == 3) {
                while(statusMsgs.length > 4){
                    statusMsgs.pop();
                }
            }
        }

        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px Raleway';
        ctx.fillText('Game Log:', status_x, status_y);
        ctx.font = '16px Raleway';
        statusMsgs.forEach((msg, i) => {
            if(i > 0) ctx.fillStyle = '#999';
            ctx.fillText(msg, status_x, status_y + ((i + 1) * lineHeight));
        });
        ctx.closePath();

        // draw buttons
        let btn = this.undoBtn;

        ctx.beginPath();
        ctx.fillStyle = '#900';
        ctx.fillRect(btn.x, btn.y, btn.width, btn.height);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 15px Raleway';
        ctx.fillText('Undo', btn.x + 30, btn.y + 22);
        ctx.closePath();
    }

    finishTurn() {
        let nextTeam = this.team1.side == this.whosTurn() ? this.team1 : this.team2;
        let prevTeam = nextTeam.side == this.team1.side ? this.team2 : this.team1;

        // this.isTeamInCheck(nextTeam, prevTeam);
        // this.isTeamInCheck(prevTeam, nextTeam);
        this.updateStatus("It\'s " + nextTeam.getSide() + "\'s turn.");
    }

    getBlackTeam() {
        return this.team1.side == SIDE.black ? this.team1 : this.team2;
    }

    getWhiteTeam() {
        return this.team1.side == SIDE.white ? this.team1 : this.team2;
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
        let latestTurn = this.turns[this.turns.length - 1];
        let piece = latestTurn.movedPiece;
        let capturedPiece = latestTurn.captures.length > 0 ? latestTurn.captures[latestTurn.captures.length - 1] : null;

        // move the piece to it's previous position
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
