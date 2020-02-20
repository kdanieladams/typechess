import { CANVASMARGIN } from '../../globals';
import { Turn } from '../Turn';


export class ChessUiHtml {
    private _initialized: boolean = false;
    private _msgs_div: HTMLDivElement;
    private _score_white: HTMLSpanElement;
    private _score_black: HTMLSpanElement;
    private _ui_div: HTMLDivElement;

    callback_save = null;
    callback_load = null;
    callback_reset = null;
    callback_undo = null;

    constructor(ui_div: HTMLDivElement) {
        this._ui_div = ui_div;
        this._ui_div.innerHTML = "";
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

        saveBtn.onclick = typeof(this.callback_save) == 'function' ? this.callback_save : this._handle_click;
        loadBtn.onclick = typeof(this.callback_load) == 'function' ? this.callback_load : this._handle_click;
        resetBtn.onclick = typeof(this.callback_reset) == 'function' ? this.callback_reset : this._handle_click;
        undoBtn.onclick = typeof(this.callback_undo) == 'function' ? this.callback_undo : this._handle_click;

        aside.append(saveBtn, loadBtn, resetBtn, undoBtn);
        this._ui_div.appendChild(aside);
    }

    private _add_header() {
        let header = document.createElement("header"),
            score_h4 = document.createElement("h4"),
            msgs_h4 = document.createElement("h4");

        score_h4.innerHTML = "Score";
        msgs_h4.innerHTML = "Game Log";
        
        header.append(score_h4, msgs_h4);
        this._ui_div.appendChild(header);
    }

    private _add_msgs() {
        let msgs = document.createElement("div");

        msgs.classList.add("msgs");
        msgs.innerHTML = "Loading...";

        this._ui_div.appendChild(msgs);
        this._msgs_div = msgs;
    }

    private _add_score() {
        let score = document.createElement("div"),
            white_hdr = document.createElement("span"),
            white_score = document.createElement("span"),
            black_hdr = document.createElement("span"),
            black_score = document.createElement("span");

        white_hdr.classList.add("score-hdr", "white");
        white_score.classList.add("white");
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
        this._score_white = white_score;
    }

    _handle_click(event) {
        console.error("Click not implemented for " + event.target.innerHTML);
        return false;
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

        // update msgs
        this._msgs_div.innerHTML = "";
        for(let i = 0; i < turns.length; i++) {
            let turn = turns[turns.length - 1 - i];
            for(let j = 0; j < turn.msgs.length; j++) {
                let msg = turn.msgs[turn.msgs.length - 1 - j],
                    msg_div = document.createElement("div");
                
                msg_div.innerHTML = msg;
                this._msgs_div.appendChild(msg_div);
            }
        }
    }

    getUiDiv(): HTMLDivElement {
        return this._ui_div;
    }
}
