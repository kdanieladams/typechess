import '../styles.css';
import '../typechess.css';
import * as config from './config.json';

import { SIDE } from './globals';
import { Board } from './lib/Board';
import { ChessUiHtml } from './lib/ui/ChessUiHtml';
import { Match } from './lib/Match';
import { Team } from './lib/Team';

/**
 * Start
 */
window.addEventListener('load', (load_event) => {
    let canvas = document.getElementById(config.canvasId) as HTMLCanvasElement,
        match = null,
        pieces = document.getElementById(config.piecesImgId) as HTMLImageElement,
        ui_div = document.getElementById(config.uiId) as HTMLDivElement;
        
    match = new Match(new Board(canvas, pieces), 
        new Team(SIDE.white), 
        new Team(SIDE.black),
        new ChessUiHtml(ui_div));
    match.draw();

    canvas.addEventListener('click', (event) => {
        match.click(event);
    });
});