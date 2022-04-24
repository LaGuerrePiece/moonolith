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
  }

    // COLORS

    // Palette Vanilla Milkshake
    // static get RGB1() { return [1, 0.9686, 0.8941] } // #fff7e4
    // static get RGB2() { return [0.4235, 0.33725, 0.44313] } // #6c5671
    // static get RGB3() { return [0.8509, 0.7843, 0.7490] } // #d9c8bf
    // static get RGB4() { return [0.9764, 0.5098, 0.5176] } // #f98284
    // static get RGB5() { return [0.6901, 0.6627, 0.8941] } // #b0a9e4
    // static get RGB6() { return [0.6745, 0.8, 0.8941] } // #accce4
    // static get RGB7() { return [0.7019, 0.8901, 0.8549] } // #b3e3da
    // static get RGB8() { return [0.996, 0.667, 0.8941] } // #feaae4
    // static get RGB9() { return [0.5294, 0.6588, 0.5372] } // #87a889
    // static get RGB10() { return [0.6901, 0.9215, 0.5764] } // #b0eb93
    // static get RGB11() { return [0.9137, 0.9607, 0.6156] } // #e9f59d
    // static get RGB12() { return [1, 0.9019, 0.7764] } // #ffe6c6
    // static get RGB13() { return [0.8705, 0.6392, 0.5450] } // #dea38b
    // static get RGB14() { return [1, 0.7647, 0.5176] } // #ffc384
    // static get RGB15() { return [1, 0.9686, 0.6274] } // #fff7a0
    // static get RGB16() { return [0.1568, 0.1568, 0.1803] } // #28282e SAME AS DEFAULT_COLOR

    // Palette Sweetie 16
    static get RGB1() { return [ 0.145, 0.4431, 0.4745 ] } // #257179 
    static get RGB2() { return [ 0.2196, 0.7176, 0.3921 ] } // #38b764 
    static get RGB3() { return [ 0.6549, 0.9411, 0.4392 ] } // #a7f070 
    static get RGB4() { return [ 1, 0.8039, 0.4588 ] } // #ffcd75 
    static get RGB5() { return [ 0.9372, 0.4901, 0.3411 ] } // #ef7d57 
    static get RGB6() { return [ 0.6941, 0.2431, 0.3254 ] } // #b13e53 
    static get RGB7() { return [ 0.3647, 0.1529, 0.3647 ] } // #5d275d 
    static get RGB8() { return [ 0.1019, 0.1098, 0.1725 ] } // #1a1c2c 
    static get RGB9() { return [ 0.1607, 0.2117, 0.4352 ] } // #29366f 
    static get RGB10() { return [ 0.2313, 0.3647, 0.7882 ] } // #3b5dc9 
    static get RGB11() { return [ 0.2549, 0.6509, 0.9647 ] } // #41a6f6 
    static get RGB12() { return [ 0.4509, 0.9372, 0.9686 ] } // #73eff7 
    static get RGB13() { return [ 0.9568, 0.9568, 0.9568 ] } // #f4f4f4 
    static get RGB14() { return [ 0.5803, 0.6901, 0.7607 ] } // #94b0c2 
    static get RGB15() { return [ 0.3372, 0.4235, 0.5254 ] } // #566c86 
    static get RGB16() { return [ 0.2, 0.2352, 0.3411 ] } // #333c57 


    static get DEFAULT_COLOR() { return [0.1568, 0.1568, 0.1803] } // #28282e
    static get SKY_COLOR() { return [0.2902, 0.6431, 0.6549] }  // #4d8c9e


    static get PALETTE() { return [this.RGB1, this.RGB2, this.RGB3, this.RGB4, this.RGB5, this.RGB6, this.RGB7, this.RGB8, this.RGB9, this.RGB10, this.RGB11, this.RGB12, this.RGB13, this.RGB14, this.RGB15, this.RGB16] }
    
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