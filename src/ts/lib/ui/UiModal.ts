import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';

const swal: SweetAlert = _swal as any;

export class UiModal {
    title: string;
    message: string;
    message_element: HTMLElement;

    constructor();
    constructor(title: string, msg: HTMLElement);
    constructor(title: string, msg: string);
    constructor(title?: string, msg?: any) {
        if(title) 
            this.title = title;
        
        if(typeof(msg) == 'string') 
            this.message = msg;
        else if(msg instanceof HTMLElement) 
            this.message_element = msg;
    }

    click(event: MouseEvent) {
        if(!this.message_element)
            swal(this.title, this.message);
        else {
            swal({
                title: this.title,
                content: { element: this.message_element }
            });
        }
    }
}