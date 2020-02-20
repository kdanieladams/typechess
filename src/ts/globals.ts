import * as config from './config.json';


/**
 * Enums
 */
export enum PIECETYPE {
    empty = 0,
    pawn = 1,
    rook = 2,
    knight = 3,
    bishop = 4,
    queen = 5,
    king = 6
};

export enum SIDE {
    black = 0,
    white = 1
};

export enum FILE {
    a = 0,
    b = 1,
    c = 2,
    d = 3,
    e = 4,
    f = 5,
    g = 6,
    h = 7
}


/**
 * Colors
 */
export const LIGHTSQCOLOR       = config.colorSqLight;
export const DARKSQCOLOR        = config.colorSqDark;
export const POSSIBLESQCOLOR    = config.colorSqPossible;
export const CASTLEABLESQCOLOR  = config.colorSqCastleable;


/**
 * Dimensions
 */
export const NUMRANKS           = 8;
export const NUMFILES           = Object.keys(FILE).length / 2;
export const CELLWIDTH          = config.cellWidth;
export const PIECESPRITEWIDTH   = config.spriteWidth;
export const CANVASWIDTH        = config.canvasWidth;
export const CANVASMARGIN       = config.canvasMargin;


/**
 * Fonts
 */
export const UIFONTLARGE = config.uiFontLarge;
export const UIFONTSMALL = config.uiFontSmall;
export const UIFONTBTN = config.uiFontBtn;


/**
 * Functions
 */
export const CAPITALIZE = function(str: string){
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const GETENUMKEY = function(enumerable: any, index: number) {
    let keys = Object.keys(enumerable),
        ret: any;

    keys.forEach((key, i) => {
        let member = enumerable[key],
            isValueProperty = parseInt(member, 10) >= 0;

        if (isValueProperty && (i - (keys.length / 2)) == index) {
            ret = enumerable[member];
        }
    });

    return ret;
}
