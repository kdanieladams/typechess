import '../styles.css';
import * as config from './config.json';

import { SIDE } from './globals';
import { Board } from './lib/Board';
import { Match } from './lib/Match';
import { Team } from './lib/Team';

/**
 * Start
 */
window.addEventListener('load', (event) => {
    let canvas = document.getElementById(config.canvasId) as HTMLCanvasElement,
        pieces = document.getElementById(config.piecesImgId) as HTMLImageElement,
        match = new Match(new Board(canvas, pieces), new Team(SIDE.white), new Team(SIDE.black));
    
    match.draw();

    canvas.addEventListener('click', (event) => {
        match.click(event);
    });
});