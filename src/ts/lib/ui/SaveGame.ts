import { Team } from '../Team';
import { Turn } from '../Turn';

export class SaveGame {
    name: string;
    saveDate: Date;
    team1: Team;
    team2: Team;
    turns: Array<Turn>;

    constructor(name: string, team1: Team, team2: Team, turns: Array<Turn>) {
        this.saveDate = new Date();
        this.name = name;
        this.team1 = team1;
        this.team2 = team2;
        this.turns = turns;
    }
}
