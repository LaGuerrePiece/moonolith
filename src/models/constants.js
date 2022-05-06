var monolithHeight;

//prettier-ignore
export default class Const { 

  static get COLUMNS() { return 370 }
  static get LINES() { return monolithHeight + this.MARGIN_TOP + this.MARGIN_BOTTOM }
  static get MONOLITH_COLUMNS() { return this.COLUMNS - this.MARGIN_LEFT - this.MARGIN_RIGHT }
  static get MONOLITH_LINES() { return monolithHeight }
  
  static get MARGIN_TOP() { return 54 }
  static get MARGIN_BOTTOM() { return 198 }
  static get MARGIN_LEFT() { return 50 }
  static get MARGIN_RIGHT() { return 65 }
  
  static get GUI_RELATIVE_Y() { return 1.05 }
  static get GUI_RELATIVE_X() { return 2 }
  
  static get FREE_DRAWING() { return 999999 }
  
  static setMonolithHeight(height) {
    monolithHeight = height
  }

    // COLORS

    static get RGB16() { return [ 47, 60, 153 ] } // #2f3c99
    static get RGB2() { return [ 102, 62, 146 ] } // #663e92
    static get RGB3() { return [ 222, 110, 208 ] } // #de6ed0
    static get RGB4() { return [ 255, 137, 131 ] } // #ff8983
    static get RGB5() { return [ 201, 76, 56 ] } // #c94c38
    static get RGB6() { return [ 207, 138, 118 ] } // #cf8a76
    static get RGB7() { return [ 36, 31, 44 ] } // #241f2c
    static get RGB8() { return [ 132, 122, 145 ] } // #847a91
    static get RGB9() { return [ 68, 157, 215 ] } // #449dd7
    static get RGB10() { return [ 46, 117, 87 ] } // #2e7557
    static get RGB11() { return [ 65, 166, 246 ] } // #81e280
    static get RGB12() { return [ 129, 226, 128 ] } // #f5d284
    static get RGB13() { return [ 245, 210, 132 ] } // #f48d56
    static get RGB14() { return [ 105, 69, 57 ] } // #694539
    static get RGB15() { return [ 232, 227, 213 ] } // #e8e3d5
    static get RGB1() { return [ 0, 0, 0 ] } // #000000
    
    static get DEFAULT_COLOR() { return [50, 44, 60] } // #28282e
    static get SKY_COLOR() { return [196, 130, 127] }  // #c4827f
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
