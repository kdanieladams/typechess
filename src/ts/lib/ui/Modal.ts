import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
// import { SwalParams } from 'sweetalert/typings/core'
// import { SwalOptions } from 'sweetalert/typings/modules/options';
import { ButtonList } from 'sweetalert/typings/modules/options/buttons';

const swal: SweetAlert = _swal as any;

export class Modal {
    title: string;
    message: string;
    message_element: HTMLElement;
    buttons: ButtonList | Array<string | boolean>;
    dangerMode: boolean = false;

    constructor()
    constructor(title: string, msg: HTMLElement)
    constructor(title: string, msg: string)
    constructor(title: string, msg: string | HTMLElement, buttons: ButtonList | Array<string | boolean>)
    constructor(title: string, msg: string | HTMLElement, buttons: ButtonList | Array<string | boolean>, dangerMode: boolean)
    constructor(title?: string, msg?: string | HTMLElement, buttons?: ButtonList | Array<string | boolean>, dangerMode?: boolean) 
    {
        if(title) 
            this.title = title;
        
        if(typeof(msg) == 'string') 
            this.message = msg;
        else if(msg instanceof HTMLElement) 
            this.message_element = msg;
        
        if(buttons)
            this.buttons = buttons;

        if(dangerMode)
            this.dangerMode = dangerMode;
    }

    show(event: MouseEvent): Promise<any> {
        let options: any = {};

        if(this.title) 
            options.title = this.title;

        if(this.message && this.message.length > 0) 
            options.text = this.message;
        else if(this.message_element) 
            options.content = { element: this.message_element };

        if(this.buttons) {
            options.buttons = true;
            options.buttons = this.buttons;
        }

        if(this.dangerMode) {
            options.dangerMode = true;
        }

        return swal(options);
    }
}