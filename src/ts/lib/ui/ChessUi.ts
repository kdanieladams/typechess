import { CANVASMARGIN, CANVASWIDTH, SAVEGAMEPREFIX, SIDE } from '../../globals';
import { ButtonList } from './_ButtonOptions';
import { Modal } from './Modal';
import { SaveGame } from './SaveGame';
import { Turn } from '../Turn';


export class ChessUi {
    private _ai_side: string = null;
    private _initialized: boolean = false;
    private _msgs_ul: HTMLUListElement;
    private _score_hdr_white: HTMLSpanElement;
    private _score_white: HTMLSpanElement;
    private _score_hdr_black: HTMLSpanElement;
    private _score_black: HTMLSpanElement;
    private _ui_div: HTMLDivElement;

    callback_save = null;
    callback_load = null;
    callback_reset = null;
    callback_undo = null;
    callback_engage_ai = null;

    constructor(ui_div: HTMLDivElement) {
        this._ui_div = ui_div;
        this._ui_div.innerHTML = "";
        this._ui_div.style.width = CANVASWIDTH + "px";
    }

    private _add_btns() {
        let aside = document.createElement("aside"),
            saveBtn = document.createElement("button"),
            loadBtn = document.createElement("button"),
            resetBtn = document.createElement("button"),
            undoBtn = document.createElement("button");

        saveBtn.classList.add("success");
        resetBtn.classList.add("danger");

        saveBtn.innerHTML = "💾 Save";
        loadBtn.innerHTML = "📁 Load";
        resetBtn.innerHTML = "↻ Reset";
        undoBtn.innerHTML = "↶ Undo";

        saveBtn.onclick = (e) => { 
            this._click_save(e).then((saveGameName) => { 
                if(typeof(saveGameName) == 'string') {
                    if(typeof(this.callback_save) == 'function')
                        this.callback_save(saveGameName); 
                    else
                        this._click_fallback(e);
                }
            }); 
        } 
        
        loadBtn.onclick = (e) => {
            this._click_load(e).then((params) => {
                if(typeof(params) == 'object' && params.name){
                    let saveGameKey = SAVEGAMEPREFIX + "_" + params.name,
                        savedGame = JSON.parse(window.localStorage.getItem(saveGameKey)) as SaveGame;
                    
                    if(params.delete) {
                        // console.log('delete game: ' + savedGame.name);
                        this._delete_game(params.name, saveGameKey, loadBtn);
                    }
                    else {
                        // console.log('load game: ' + savedGame.name);
                        if(typeof(this.callback_load) == 'function')
                            this.callback_load(savedGame);
                        else
                            this._click_fallback(e);
                    }
                }
            });
        };

        resetBtn.onclick = (e) => {
            this._click_reset(e).then((value) => {
                if(value === true) {
                    if (typeof(this.callback_reset) == 'function')
                        this.callback_reset(e);
                    else
                        this._click_fallback(e);
                }
            });
        };

        undoBtn.onclick = typeof(this.callback_undo) == 'function' ? this.callback_undo : this._click_fallback;

        aside.appendChild(saveBtn);
        aside.appendChild(loadBtn);
        aside.appendChild(resetBtn);
        aside.appendChild(undoBtn);
        this._ui_div.appendChild(aside);
    }

    private _add_header() {
        let header = document.createElement("header"),
            score_h4 = document.createElement("h4"),
            msgs_h4 = document.createElement("h4");

        score_h4.innerHTML = "Score";
        msgs_h4.innerHTML = "Game Log";
        
        header.appendChild(score_h4)
        header.appendChild(msgs_h4);
        this._ui_div.appendChild(header);
    }

    private _add_msgs() {
        let msgs = document.createElement("ul");

        msgs.classList.add("msgs");
        msgs.innerHTML = "Loading...";

        this._ui_div.appendChild(msgs);
        this._msgs_ul = msgs;
    }

    private _add_score() {
        let score = document.createElement("div"),
            white_hdr = document.createElement("span"),
            white_score = document.createElement("span"),
            black_hdr = document.createElement("span"),
            black_score = document.createElement("span");

        white_hdr.classList.add("score-hdr", "white", "active");
        white_score.classList.add("white", "active");
        white_score.id = "score_white";

        black_hdr.classList.add("score-hdr", "black");
        black_score.classList.add("black");
        black_score.id = "score_black";
        
        white_hdr.innerHTML = "White:";
        white_score.innerHTML = "0";
        black_hdr.innerHTML = "Black:";
        black_score.innerHTML = "0";

        score.classList.add("score");
        score.appendChild(white_hdr);
        score.appendChild(white_score);
        score.appendChild(black_hdr);
        score.appendChild(black_score);

        this._ui_div.appendChild(score);
        this._score_black = black_score;
        this._score_hdr_black = black_hdr;
        this._score_white = white_score;
        this._score_hdr_white = white_hdr;

        this._score_black.onclick = (e) => {
            this._click_score(0);
        };
        this._score_hdr_black.onclick = (e) => {
            this._click_score(0);
        };

        this._score_white.onclick = (e) => {
            this._click_score(1);
        };
        this._score_hdr_white.onclick = (e) => {
            this._click_score(1);
        };
    }

    private _click_fallback(event: MouseEvent) {
        console.error("Click not implemented for " + (event.target as HTMLElement).innerHTML);
        return false;
    }

    private _click_load(event): Promise<any> {
        let title = "Load Game",
            msg = document.createElement("div"),
            buttons: ButtonList,
            modal: Modal,
            saveGames: Array<SaveGame> = [];

        for(let i = 0; i < window.localStorage.length; i++) {
            let key = window.localStorage.key(i);
            if(key.indexOf(SAVEGAMEPREFIX) == 0) {
                let saveGame = JSON.parse(window.localStorage.getItem(key)) as SaveGame;
                saveGames.push(saveGame);
            }
        }

        saveGames.sort((a: SaveGame, b: SaveGame) => {
            if(a.saveDate > b.saveDate)
                return -1;

            if(a.saveDate < b.saveDate)
                return 1;

            return 0;
        });

        msg.innerHTML = "Choose a game to load:";
        saveGames.forEach((saveGame, i) => {
            let formGroup = document.createElement("div"),
                radioBtn = document.createElement("input"),
                radioLbl = document.createElement("label");
            
            formGroup.className = "form-group";
            radioBtn.type = "radio";
            radioBtn.name = "savegame";
            radioBtn.value = saveGame.name;
            radioBtn.id = (i + 1) + "_" + saveGame.name;

            if(i == 0) {
                radioBtn.checked = true;
            }

            saveGame.saveDate = new Date(saveGame.saveDate);
            radioLbl.setAttribute("for", radioBtn.id);
            radioLbl.innerHTML = saveGame.saveDate.toLocaleDateString() 
                + " " + saveGame.saveDate.toLocaleTimeString()
                + " - " + saveGame.name;

            formGroup.appendChild(radioBtn);
            formGroup.appendChild(radioLbl);
            msg.appendChild(formGroup);
        });

        buttons = {
            cancel: true,
            delete: {
                text: "Delete",
                value: "delete",
                className: "danger"
            },
            confirm: {
                text: "Load Game",
                value: true
            }
        };
        modal = new Modal(title, msg, buttons);

        return modal.show().then((value) => {
            let chosenGameElm = document.querySelector('input[name="savegame"]:checked') as HTMLInputElement;

            switch(value) {
                case true:
                    return {
                        delete: false,
                        name: chosenGameElm.value
                    }
                    break;
                case "delete":
                    return {
                        delete: true,
                        name: chosenGameElm.value
                    };
                    break;
                default:
                    return false;
            }
        });
    }

    private _click_reset(event): Promise<any> {
        let title = "Reset Board",
            msg = "Are you sure you want to reset the board to a new game?",
            modal: Modal;

        modal = new Modal(title, msg, [true, "Reset Board"], true);
        return modal.show();
    }

    private _click_save(event): Promise<any> {
        let title = "Save Game",
            msg = document.createElement("div"),
            modal: Modal;

        msg.innerHTML = `
            Enter a name for the save:
            <div class="form-group">
                <input type="text" id="saveGameName" placeholder="Save Game 1">
            </div>
        `;

        modal = new Modal(title, msg, [true, "Save Game"]);
        
        return modal.show().then((value) => {
            if(value === true) {
                let saveGameName = (document.getElementById("saveGameName") as HTMLInputElement).value;
                return saveGameName;
            }

            return false;
        });
    }

    private _click_score(sideNum: number) {
        let side: string = SIDE[sideNum],
            msg: string,
            modal: Modal;

        if(side != this._ai_side) {
            // turn ai on...
            msg = "Are you sure you want the AI to control " + side + "?",
            modal = new Modal("Engage AI", msg, ["Cancel", "OK"]);

            modal.show().then((confirmAi) => {
                if(confirmAi) {
                    if(sideNum == SIDE.white) {
                        this._score_hdr_white.innerHTML = "💻 White:";
                        this._score_hdr_black.innerHTML = "Black:";
                    }
                    else {
                        this._score_hdr_black.innerHTML = "💻 Black:";
                        this._score_hdr_white.innerHTML = "White:";
                    }

                    this._ai_side = side;

                    if (typeof(this.callback_engage_ai) == 'function')
                        this.callback_engage_ai(sideNum);
                    else
                        this._click_fallback(null);
                }
            });
        }
        else {
            // turn ai off...
            msg = "Are you sure you want to turn the ai off?",
            modal = new Modal("Disengage AI", msg, ["Cancel", "OK"]);

            modal.show().then((confirmNoAi) => {
                if(confirmNoAi) {
                    this._score_hdr_white.innerHTML = "White:";
                    this._score_hdr_black.innerHTML = "Black:";
                    this._ai_side = null;

                    if (typeof(this.callback_engage_ai) == 'function')
                        this.callback_engage_ai(sideNum, true);
                    else
                        this._click_fallback(null);
                }
            });
        }

        return;
    }

    private _delete_game(saveGameName: string, saveGameKey: string, loadBtn: HTMLButtonElement) {
        let confirmModal: Modal,
            successModal: Modal,
            modalTitle = "Delete Game";

        confirmModal = new Modal(modalTitle, "Are you sure you want to delete \'" + saveGameName + "\'?", ["Cancel", "Delete it"], true);
        confirmModal.show().then((confirmDelete) => {
            if(confirmDelete) {
                window.localStorage.removeItem(saveGameKey);
                successModal = new Modal(modalTitle, "\'" + saveGameName + "\' was successfully deleted.");
                successModal.show();
            }
            else {
                loadBtn.click();
            }
        });
    }

    draw(white_score: number, black_score: number, turns: Turn[]) {
        if(!this._initialized) {
            this._add_header();
            this._add_score();
            this._add_msgs();
            this._add_btns();
            this._initialized = true;
        }

        // update score
        this._score_black.innerHTML = black_score.toString();
        this._score_white.innerHTML = white_score.toString();

        // highlight active team
        if(turns.length % 2) {
            this._score_hdr_white.classList.remove("active");
            this._score_white.classList.remove("active");
            this._score_hdr_black.classList.add("active");
            this._score_black.classList.add("active");
        }
        else {
            this._score_hdr_black.classList.remove("active");
            this._score_black.classList.remove("active");
            this._score_hdr_white.classList.add("active");
            this._score_white.classList.add("active");
        }

        // update msgs
        this._msgs_ul.innerHTML = "";
        for(let i = 0; i < turns.length; i++) {
            let turn = turns[turns.length - 1 - i];
            for(let j = 0; j < turn.msgs.length; j++) {
                let msg = turn.msgs[turn.msgs.length - 1 - j],
                    msg_div = document.createElement("li");
                
                msg_div.innerHTML = msg;
                this._msgs_ul.appendChild(msg_div);
            }
        }
    }

    getUiDiv(): HTMLDivElement {
        return this._ui_div;
    }
}
