import { CANVASMARGIN, UIFONTLARGE, UIFONTSMALL, UIFONTBTN } from '../globals';
import { UiBtn } from './UiBtn';
import { Turn } from './Turn';

export class Ui {
    private undoBtn: UiBtn;
    private resetBtn: UiBtn;
    private tieBtn: UiBtn;
    private saveBtn: UiBtn;

    constructor() {
        let btnWidth = 91, 
            btnHeight = 32,
            btnStart = 94,
            btnMargin = 3;

        this.undoBtn = new UiBtn('↶ Undo', btnWidth, btnHeight, CANVASMARGIN, 
            btnStart, '#900', '#fff');
        this.resetBtn = new UiBtn('↻ Reset', btnWidth, btnHeight, CANVASMARGIN, 
            btnStart + btnHeight + btnMargin);
        this.tieBtn = new UiBtn('📁 Load', btnWidth, btnHeight, CANVASMARGIN + btnWidth + btnMargin, 
            btnStart);
        this.saveBtn = new UiBtn('💾 Save', btnWidth, btnHeight, CANVASMARGIN + btnWidth + btnMargin, 
            btnStart + btnHeight + btnMargin, '#090', '#fff');
    }

    private _clickedBtn(event, btn) {
        return (event.offsetX >= btn.x 
            && event.offsetX <= btn.x + btn.width
            && event.offsetY >= btn.y
            && event.offsetY <= btn.y + btn.height);
    }

    clickedUndoBtn(event) {
        return this._clickedBtn(event, this.undoBtn);
    }

    clickedResetBtn(event) {
        return this._clickedBtn(event, this.resetBtn);
    }

    draw(ctx: CanvasRenderingContext2D, whiteScore: number, blackScore: number, turns: Turn[]) {
        // 170px by 640px = total UI area
        let score_x = 0 + CANVASMARGIN, 
            score_y = 15 + CANVASMARGIN,
            score_width = 200,
            status_x = score_width + CANVASMARGIN, 
            status_y = 15 + CANVASMARGIN,
            ui_height = 170;

        // draw the score
        let scoreTxt = ['Score:',
            'White: ' + whiteScore,
            'Black: ' + blackScore
        ];
        let lineHeight = 25;
        
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.font = UIFONTLARGE;
        scoreTxt.forEach((str, i) => {
            if(i > 0) ctx.font = UIFONTSMALL;
            if(i > 1) lineHeight = 23;
            ctx.fillText(str, score_x, score_y + (i * lineHeight), score_width);
        });
        ctx.closePath();

        // draw the last five status messages
        let statusMsgs: string[] = new Array();
        lineHeight = 25;

        for(let i = 0; i < 5; i++) {
            let turn: Turn = turns[turns.length - 1 - i];
            if(turn != undefined) {
                for(let j = 0; j < turn.msgs.length; j++) {
                    let msg = turn.msgs[turn.msgs.length - j - 1];
                    statusMsgs.push(msg);
                }
            }
            if(i == 4) {
                while(statusMsgs.length > 5){
                    statusMsgs.pop();
                }
            }
        }

        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.font = UIFONTLARGE;
        ctx.fillText('Game Log:', status_x, status_y);
        ctx.font = UIFONTSMALL;
        statusMsgs.forEach((msg, i) => {
            if(i > 0) ctx.fillStyle = '#999';
            ctx.fillText(msg, status_x, status_y + ((i + 1) * lineHeight));
        });
        ctx.closePath();

        // draw buttons
        let btns: UiBtn[] = [this.undoBtn, this.resetBtn, this.tieBtn, this.saveBtn];

        btns.forEach(btn => {
            ctx.beginPath();
            ctx.fillStyle = btn.bgColor;
            ctx.fillRect(btn.x, btn.y, btn.width, btn.height);
            ctx.fillStyle = btn.textColor;
            ctx.font = UIFONTBTN;
            ctx.textAlign = 'center';
            ctx.fillText(btn.title, btn.x + (btn.width / 2), btn.y + 22);
            ctx.closePath();
            ctx.textAlign = 'left';
        });
    }
}
