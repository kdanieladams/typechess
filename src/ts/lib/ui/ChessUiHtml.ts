import { CANVASMARGIN } from '../../globals';

export class ChessUiHtml {
    private _initialized: boolean = false;
    private _msgs_div: HTMLDivElement;
    private _score_white: HTMLSpanElement;
    private _score_black: HTMLSpanElement;
    private _ui_div: HTMLDivElement;

    constructor(ui_div: HTMLDivElement) {
        this._ui_div = ui_div;
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

        // TODO: tie up button onClick callbacks

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

    draw() {
        if(!this._initialized) {
            this._add_header();
            this._add_score();
            this._add_msgs();
            this._add_btns();
            this._initialized = true;
        }
    }
}
