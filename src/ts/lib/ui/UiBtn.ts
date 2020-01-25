export class UiBtn {
    width: number;
    height: number;
    x: number;
    y: number;
    title: string;
    bgColor: string;
    textColor: string;

    constructor(title: string, width: number, height: number, 
        x: number, y: number, bgColor: string = '#333', textColor: string = '#ccc') 
    {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.title = title;
        this.bgColor = bgColor;
        this.textColor = textColor;
    }
}
