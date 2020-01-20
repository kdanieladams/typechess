import { FILE, PIECETYPE, SIDE } from '../globals';
import { Board } from './Board';
import { Team } from './Team';

/**
 * Match
 */
export class Match {
    board: Board;
    team1: Team;
    team2: Team;

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
}
