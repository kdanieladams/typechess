export class UiModal {
    width: number;
    height: number;
    x: number;
    y: number;
    title: string;
    message: string;

    constructor(title: string, msg: string, width: number, height: number, x: number, y: number) 
    {
        this.title = title;
        this.message = msg;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }
}