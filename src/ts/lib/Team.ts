import { SIDE } from '../globals';

export class Team {
    side: number;

    constructor(side: number) {
        this.side = side == SIDE.white ? SIDE.white : SIDE.black;
    }
}