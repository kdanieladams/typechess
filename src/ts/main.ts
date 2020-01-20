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
    
    match.board.draw();
    // match.team1.pieces[0].getDiagMoves(match.board, true, true);

    // canvas.addEventListener('click', (event) => {
    //     let cell = match.board.getCellByPixels(event.offsetX, event.offsetY);
    //     console.log('You clicked ' + event.offsetX + ' x ' + event.offsetY);
    //     console.log('Board returned: ' + cell.getCoord());
    // });
});