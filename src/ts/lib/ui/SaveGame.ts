import { SIDE } from '../../globals';
import { Team } from '../Team';
import { Turn } from '../Turn';

export class SaveGame {
    name: string;
    saveDate: Date;
    team1: Team;
    team2: Team;
    turns: Array<Turn>;

    constructor(name?: string, team1?: Team, team2?: Team, turns?: Array<Turn>) {
        this.saveDate = name ? new Date() : null;
        this.name = name ? name : '';
        this.team1 = team1 ? team1 : null;
        this.team2 = team2 ? team2 : null;
        this.turns = turns ? turns : null;
    }

    getTeam(side: SIDE) {
        return this.team1.side == side ? this.team1 : this.team2;
    }

    translateFromJson(saveGameObj: any) : SaveGame {
        let team1 = new Team(SIDE.white),
            team2 = new Team(SIDE.black);
        
        Object.assign(this, saveGameObj);
        this.team1 = team1.translateFromJson(this.team1);
        this.team2 = team2.translateFromJson(this.team2);
        
        return this;
    }
}
