export interface ButtonOptions {
    visible?: boolean;
    text?: string;
    value?: any;
    className?: string | Array<string>;
    closeModal?: boolean;
}

export interface ButtonList {
    [buttonNamespace: string]: ButtonOptions | boolean | string;
}
