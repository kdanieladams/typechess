// import { defaultButtonList } from 'sweetalert/typings/modules/options/buttons';
import { ButtonOptions, ButtonList } from './_ButtonOptions';

let default_btn: ButtonOptions = {
    text: "Ok",
    value: true
};
let cancel_btn: ButtonOptions = {
    text: "Cancel",
    value: false
};

export class Modal {
    title: string;
    message: string | HTMLElement;
    buttons: ButtonList | Array<string | boolean>;
    button_options: Array<ButtonOptions> = new Array<ButtonOptions>();
    dangerMode: boolean = false;

    constructor()
    constructor(title: string, msg: HTMLElement)
    constructor(title: string, msg: string)
    constructor(title: string, msg: string | HTMLElement, buttons: ButtonList | Array<string | boolean>)
    constructor(title: string, msg: string | HTMLElement, buttons: ButtonList | Array<string | boolean>, dangerMode: boolean)
    constructor(title?: string, msg?: string | HTMLElement, buttons?: ButtonList | Array<string | boolean>, dangerMode?: boolean) 
    {
        // default button(s)
        this.buttons = {
            confirm: default_btn
        };

        if(title) 
            this.title = title;
        
        if(msg) {
            if(typeof msg == "string")
                this.message = msg;
            else {
                let str: string = new XMLSerializer().serializeToString(msg);
                this.message = str;
            }
        }
        
        if(buttons)
            this.buttons = buttons;

        if(dangerMode)
            this.dangerMode = dangerMode;

        // translate ButtonList to Array<ButtonOptions>
        Object.keys(this.buttons).forEach((key, index) => {
            let btn = this.buttons[key];
            this._translateBtnOption(btn, index);
        });
    }

    private _hide(): boolean {
        let modalElm: HTMLDivElement = document.getElementsByClassName("modal")[0] as HTMLDivElement,
        modalOverlay: HTMLDivElement = document.getElementsByClassName("modal-overlay")[0] as HTMLDivElement;

        // hide the modal
        modalElm.style.visibility = "hidden";
        modalOverlay.style.visibility = "hidden";

        setTimeout(() => {
            // remove the modal
            document.body.removeChild(modalOverlay);
            document.body.removeChild(modalElm);
        }, 150);
        
        return true;
    }

    private _translateBtnOption(btn: ButtonOptions | boolean | string, index: number) {
        if(typeof btn == "object") {
            this.button_options.push(btn);
        }
        else if(typeof btn == "boolean" && btn == true) {
            if(index == 0 && Object.keys(this.buttons).length > 1) {
                // cancel btn
                this.button_options.push(cancel_btn);
            }
            else if(index == 0 || index == 1) {
                // confirm btn
                this.button_options.push(default_btn);
            }
        }
        else if(typeof btn == "string") {
            let numButtons: number = Object.keys(this.buttons).length;

            if(index == 0 && numButtons > 1) {
                // cancel btn (custom text)
                this.button_options.push({
                    text: btn,
                    value: false
                });
            }
            else if(index == 0 || index == numButtons - 1) {
                // confirm btn (custom text)
                this.button_options.push({
                    text: btn,
                    value: true
                });
            }
            else {
                // tertiary btn (value == text)
                this.button_options.push({
                    text: btn,
                    value: btn
                });
            }
        }
    }

    show(): Promise<any> {
        return new Promise<any>((resolve) => {
            let modalOverlay: HTMLDivElement = document.createElement("div"),
                modalElm: HTMLDivElement = document.createElement("div"),
                titleElm: HTMLDivElement = document.createElement("div"),
                msgElm: HTMLDivElement = document.createElement("div"),
                btnsElm: HTMLDivElement = document.createElement("div");

            // style the modal
            modalOverlay.classList.add("modal-overlay");
            modalElm.classList.add("modal");
            titleElm.classList.add("title");
            msgElm.classList.add("msg");
            btnsElm.classList.add("btns");

            // add content
            titleElm.innerHTML = this.title;
            msgElm.innerHTML = this.message as string;

            // assemble the modal
            modalElm.appendChild(titleElm);
            modalElm.appendChild(msgElm);
            modalElm.appendChild(btnsElm);

            // show the modal
            document.body.appendChild(modalOverlay);
            document.body.appendChild(modalElm);

            // add btns
            this.button_options.forEach((button, index) => {
                let btn: HTMLButtonElement = document.createElement("button");

                // check for danger mode, change confirm_btn.className to suit
                if(index == 0 && this.button_options.length == 1 || index == this.button_options.length - 1) {
                    btn.classList.add("confirm");
                    if(this.dangerMode) {
                        btn.classList.add("danger");
                    }
                }

                // add btn props
                btn.value = button.value;
                btn.innerHTML = button.text;
                
                if(button.className) {
                    if(typeof button.className == "string")
                        btn.classList.add(button.className);
                    else 
                        (button.className as Array<string>).forEach(cls => { btn.classList.add(cls); });
                } 

                // setup event listener
                btn.addEventListener("click", (e) => {
                    this._hide();
                    resolve(button.value);
                });

                // add btn to btnElm
                btnsElm.appendChild(btn);
            });
        });
    }
}