import { FILE, PIECETYPE, SIDE } from '../globals.js';
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

            return this;
        }

        console.error("Match.constructor: teams must be on different sides.");
        return null;
    }
}
