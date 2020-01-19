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
export const LIGHTSQCOLOR       = config.hasOwnProperty('colorSqLight') ? config.colorSqLight : '#919191';
export const DARKSQCOLOR        = config.hasOwnProperty('colorSqDark') ? config.colorSqDark : '#333';
export const POSSIBLESQCOLOR    = config.hasOwnProperty('colorSqPossible') ? config.colorSqPossible : '#40ff00';
export const CASTLEABLESQCOLOR  = config.hasOwnProperty('colorSqCastleable') ? config.colorSqCastleable : '#5900b3';


/**
 * Dimensions
 */
export const NUMRANKS           = 8;
export const NUMFILES           = Object.keys(FILE).length / 2;
export const CELLWIDTH          = config.hasOwnProperty('cellWidth') ? config.cellWidth : 80;
export const PIECESPRITEWIDTH   = config.hasOwnProperty('spriteWidth') ? config.spriteWidth : 100;


/**
 * Functions
 */
export const CAPITALIZE = function(str: string){
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const GETENUMKEY = function(enumerable: any, index: number) {
    let keys = Object.keys(enumerable);
    for(let i = 0; i < keys.length; i++) {
        let key = keys[i],
            member = enumerable[key],
            isValueProperty = parseInt(member, 10) >= 0;
        
        if (isValueProperty && (i - (keys.length / 2)) == index) {
           return enumerable[member];
        }
    }
}
