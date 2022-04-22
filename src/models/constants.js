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

    static get RGB1() { return [1, 0.9686, 0.8941] } // #fff7e4
    static get RGB2() { return [0.4235, 0.33725, 0.44313] } // #6c5671
    static get RGB3() { return [0.8509, 0.7843, 0.7490] } // #d9c8bf
    static get RGB4() { return [0.9764, 0.5098, 0.5176] } // #f98284
    static get RGB5() { return [0.6901, 0.6627, 0.8941] } // #b0a9e4
    static get RGB6() { return [0.6745, 0.8, 0.8941] } // #accce4
    static get RGB7() { return [0.7019, 0.8901, 0.8549] } // #b3e3da
    static get RGB8() { return [0.996, 0.667, 0.8941] } // #feaae4
    static get RGB9() { return [0.5294, 0.6588, 0.5372] } // #87a889
    static get RGB10() { return [0.6901, 0.9215, 0.5764] } // #b0eb93
    static get RGB11() { return [0.9137, 0.9607, 0.6156] } // #e9f59d
    static get RGB12() { return [1, 0.9019, 0.7764] } // #ffe6c6
    static get RGB13() { return [0.8705, 0.6392, 0.5450] } // #dea38b
    static get RGB14() { return [1, 0.7647, 0.5176] } // #ffc384
    static get RGB15() { return [1, 0.9686, 0.6274] } // #fff7a0
    static get RGB16() { return [0.1568, 0.1568, 0.1803] } // #28282e SAME AS DEFAULT_COLOR

    static get DEFAULT_COLOR() { return [0.1568, 0.1568, 0.1803] } // #28282e
    static get SKY_COLOR() { return [0.2902, 0.6431, 0.6549] }  // #4d8c9e


    static get PALETTE() { return [this.RGB1, this.RGB2, this.RGB3, this.RGB4, this.RGB5, this.RGB6, this.RGB7, this.RGB8, this.RGB9, this.RGB10, this.RGB11, this.RGB12, this.RGB13, this.RGB14, this.RGB15, this.RGB16] }
    
  }
