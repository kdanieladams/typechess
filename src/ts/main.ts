import { Board } from './lib/Board';
import '../styles.css';
import * as config from './config.json';

/**
 * Start
 */
window.addEventListener('load', (event) => {
    let canvas = document.getElementById(config.canvasId) as HTMLCanvasElement,
        pieces = document.getElementById(config.piecesImgId) as HTMLImageElement,
        board = new Board(canvas, pieces);
    
    board.draw();
});