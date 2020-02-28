import '../css/styles.css';
import '../css/typechess.css';
import * as config from './config.json';
import { Typechess } from './lib/Typechess';

import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import { Modal } from './lib/ui/Modal';
import { ButtonList } from 'sweetalert/typings/modules/options/buttons';

const swal: SweetAlert = _swal as any;

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
        let title: string = "Load Game",
            msg: HTMLDivElement = document.createElement("div"),
            modal: Modal,
            buttons: ButtonList | Array<string | boolean>;
        
        msg.innerHTML = `
            Choose a previous save state: <br>
            <div class="form-group">
                <input type="radio" name="savegame" value="1" id="testing1" checked>
                <label for="testing1">00:03:24 12 Jan 2020 - Test Save 1</label>
            </div>
            <div class="form-group">
                <input type="radio" name="savegame" value="2" id="testing2">
                <label for="testing2">21:12:56 17 Jan 2020 - Testing 2</label>
            </div>
            <div class="form-group">
                <input type="radio" name="savegame" value="3" id="testing3">
                <label for="testing3">03:47:18 02 Feb 2020 - Testing 3</label>
            </div>
        `;
        
        buttons = {
            cancel: true,
            delete: {
                text: "Delete",
                value: "delete",
                className: "swal-button--danger"
            },
            confirm: {
                text: "Load it!",
                value: true
            }
        };

        modal = new Modal(title, msg, buttons);
        modal.show().then((value) => {
            let chosenSaveGame = (document.querySelector('input[name="savegame"]:checked') as HTMLInputElement).value;
            
            console.log("value = " + value);
            
            if(value === true) {
                console.log("Loaded savegame: " + chosenSaveGame);
            }
            else if(value === "delete") {
                let saveGameName = document.querySelector("input[name='savegame']:checked").id;
                (new Modal("Delete Game", 
                    "Are you sure you want to delete " + saveGameName + "?", 
                    [true, "Delete it!"], true))
                .show().then((value) => {
                    if(value === true) {
                        console.log("Deleted saveGame: " + chosenSaveGame);
                    }
                });
            }
        });
    });
});
