import '../css/styles.css';
import '../css/typechess.css';
import * as config from './config.json';
import { Typechess } from './lib/Typechess';
import { UiModal } from './lib/ui/UiModal';

/**
 * Start
 */
window.addEventListener('load', (load_event) => {
    let canvas = document.getElementById(config.canvasId) as HTMLCanvasElement,
        match = null,
        pieces = document.getElementById(config.piecesImgId) as HTMLImageElement,
        ui_div = document.getElementById(config.uiId) as HTMLDivElement;
        
    match = new Typechess(canvas, pieces, ui_div);
    match.draw();

    canvas.addEventListener('click', (event) => {
        match.click(event);
    });

    document.getElementById("test_swal").addEventListener('click', (e) => {
        let title: string = "Testing...",
            msg: HTMLDivElement = document.createElement("div"),
            modal: UiModal; 
        
        msg.innerHTML = `
            Choose one: <br>
            <input type="radio" name="savegame" value="testing1" id="testing1">
            <label for="testing1">Testing 1</label>
            <br>
            <input type="radio" name="savegame" value="testing2" id="testing2">
            <label for="testing2">Testing 2</label>
            <br>
            <input type="radio" name="savegame" value="testing3" id="testing3">
            <label for="testing3">Testing 3</label>
        `;

        modal = new UiModal(title, msg);
        modal.click(e);
    });
});
