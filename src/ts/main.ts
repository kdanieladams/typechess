import '../styles.css';
import { Board } from './lib/Board';

/**
 * Start
 */
window.addEventListener('load', (event) => {
    let canvas = document.getElementById('chess_board') as HTMLCanvasElement;
    let pieces = document.getElementById('pieces_img') as HTMLImageElement;
    let board = new Board(canvas, pieces);
    board.draw();
});