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

    static get RGB1() { return [ 37, 113, 121 ] } // #fff7e4
    static get RGB2() { return [ 56, 183, 100 ] } // #6c5671
    static get RGB3() { return [ 167, 240, 112 ] } // #d9c8bf
    static get RGB4() { return [ 255, 205, 117 ] } // #f98284
    static get RGB5() { return [ 239, 125, 87 ] } // #b0a9e4
    static get RGB6() { return [ 177, 62, 83 ] } // #accce4
    static get RGB7() { return [ 93, 39, 93 ] } // #b3e3da
    static get RGB8() { return [ 26, 28, 44 ] } // #feaae4
    static get RGB9() { return [ 41, 54, 111 ] } // #87a889
    static get RGB10() { return [ 59, 93, 201 ] } // #b0eb93
    static get RGB11() { return [ 65, 166, 246 ] } // #e9f59d
    static get RGB12() { return [ 115, 239, 247 ] } // #ffe6c6
    static get RGB13() { return [ 244, 244, 244 ] } // #dea38b
    static get RGB14() { return [ 148, 176, 194 ] } // #ffc384
    static get RGB15() { return [ 86, 108, 134 ] } // #fff7a0
    static get RGB16() { return [ 51, 60, 87 ] } // #28282e SAME AS DEFAULT_COLOR

    static get DEFAULT_COLOR() { return [40, 40, 46] } // #28282e
    static get SKY_COLOR() { return [74, 164, 167] }  // #4d8c9e


    static get PALETTE() { return [this.RGB1, this.RGB2, this.RGB3, this.RGB4, this.RGB5, this.RGB6, this.RGB7, this.RGB8, this.RGB9, this.RGB10, this.RGB11, this.RGB12, this.RGB13, this.RGB14, this.RGB15, this.RGB16] }
    
  }
