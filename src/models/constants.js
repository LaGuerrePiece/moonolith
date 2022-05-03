var monolithHeight;

//prettier-ignore
export default class Const { 

  static get COLUMNS() { return 256 }
  static get LINES() { return monolithHeight + this.MARGIN_TOP + this.MARGIN_BOTTOM }
  static get MONOLITH_COLUMNS() { return this.COLUMNS - this.MARGIN_LEFT - this.MARGIN_RIGHT }
  static get MONOLITH_LINES() { return monolithHeight }
  
  static get MARGIN_TOP() { return 54 }
  static get MARGIN_BOTTOM() { return 30 }
  static get MARGIN_LEFT() { return 47 }
  static get MARGIN_RIGHT() { return 60 }
  
  static get GUI_RELATIVE_Y() { return 1.05 }
  static get GUI_RELATIVE_X() { return 2 }
  
  static get FREE_DRAWING() { return 999999 }
  
  static setMonolithHeight(height) {
    monolithHeight = height
    console.log('monolith height set to ' + height)
  }

    // COLORS

    static get RGB16() { return [ 37, 113, 121 ] } // #257179
    static get RGB2() { return [ 56, 183, 100 ] } // #38b764
    static get RGB3() { return [ 167, 240, 112 ] } // #a7f070
    static get RGB4() { return [ 255, 205, 117 ] } // #ffcd75
    static get RGB5() { return [ 239, 125, 87 ] } // #ef7d57
    static get RGB6() { return [ 177, 62, 83 ] } // #b13e53
    static get RGB7() { return [ 93, 39, 93 ] } // #5d275d
    static get RGB8() { return [ 26, 28, 44 ] } // #1a1c2c
    static get RGB9() { return [ 41, 54, 111 ] } // #29366f
    static get RGB10() { return [ 59, 93, 201 ] } // #3b5dc9
    static get RGB11() { return [ 65, 166, 246 ] } // #41a6f6
    static get RGB12() { return [ 115, 239, 247 ] } // #73eff7
    static get RGB13() { return [ 244, 244, 244 ] } // #f4f4f4
    static get RGB14() { return [ 148, 176, 194 ] } // #94b0c2
    static get RGB15() { return [ 86, 108, 134 ] } // #566c86
    static get RGB1() { return [ 0, 0, 0 ] } // #000000
    
    static get DEFAULT_COLOR() { return [40, 40, 46] } // #28282e
    static get SKY_COLOR() { return [74, 164, 167] }  // #4d8c9e
    static get RANDOM_COLOR() { return [ Math.random()*255, Math.random()*255, Math.random()*255 ] } // #??????
    
    static get PALETTE() { return [this.RGB1, this.RGB2, this.RGB3, this.RGB4, this.RGB5, this.RGB6, this.RGB7, this.RGB8, this.RGB9, this.RGB10, this.RGB11, this.RGB12, this.RGB13, this.RGB14, this.RGB15, this.RGB16] }
    static get GUI_PALETTE() { return [this.RGB16, this.RGB2, this.RGB3, this.RGB4, this.RGB5, this.RGB6, this.RGB7, this.RGB8, this.RGB9, this.RGB10, this.RGB11, this.RGB12, this.RGB13, this.RGB14, this.RGB15, this.DEFAULT_COLOR] }
    
    
  }

// let arrayToConvert = [
//     '257179',
//     '38b764',
//     'a7f070',
//     'ffcd75',
//     'ef7d57',
//     'b13e53',
//     '5d275d',
//     '1a1c2c',
//     '29366f',
//     '3b5dc9',
//     '41a6f6',
//     '73eff7',
//     'f4f4f4',
//     '94b0c2',
//     '566c86',
//     '333c57',
// ];
// arrayToConvert.forEach((hex) => {
//     console.log(hexToRGB(hex));
// });

function hexToRGB(hex) {
    var r = Math.floor((parseInt(hex.slice(0, 2), 16) / 255) * 10000) / 10000,
        g = Math.floor((parseInt(hex.slice(2, 4), 16) / 255) * 10000) / 10000,
        b = Math.floor((parseInt(hex.slice(4, 6), 16) / 255) * 10000) / 10000;
    return [r, g, b];
}
