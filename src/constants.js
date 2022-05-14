var monolithHeight = 0;

//prettier-ignore
export default class Const { 

  static get COLUMNS() { return 370 }
  static get LINES() { return monolithHeight + this.MARGIN_TOP + this.MARGIN_BOTTOM }
  static get MONOLITH_COLUMNS() { return this.COLUMNS - this.MARGIN_LEFT - this.MARGIN_RIGHT }
  static get MONOLITH_LINES() { return monolithHeight }
  
  static get MARGIN_TOP() { return 650 }
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
    static get RGB11() { return [ 129, 226, 128 ] } // #81e280
    static get RGB12() { return [ 245, 210, 132 ] } // #f5d284
    static get RGB13() { return [ 244, 141, 86 ] } // #f48d56
    static get RGB14() { return [ 105, 69, 57 ] } // #694539
    static get RGB15() { return [ 232, 227, 213 ] } // #e8e3d5
    static get RGB1() { return [ 0, 0, 0 ] } // #000000
    
    static get DEFAULT_COLOR() { return [50, 44, 60] } // #28282e
    static get SKY_COLOR() { return [196, 130, 127] }  // #c4827f
    static get RANDOM_COLOR() { return [ Math.random()*255, Math.random()*255, Math.random()*255 ] } // #??????
    
    static get PALETTE() { return [this.RGB1, this.RGB2, this.RGB3, this.RGB4, this.RGB5, this.RGB6, this.RGB7, this.RGB8, this.RGB9, this.RGB10, this.RGB11, this.RGB12, this.RGB13, this.RGB14, this.RGB15, this.RGB16] }
    static get GUI_PALETTE() { return [this.RGB16, this.RGB2, this.RGB3, this.RGB4, this.RGB5, this.RGB6, this.RGB7, this.RGB8, this.RGB9, this.RGB10, this.RGB11, this.RGB12, this.RGB13, this.RGB14, this.RGB15, this.DEFAULT_COLOR] }
    
    static get PARALLAX_LAYERS() { return {
      '-1': 1,
      "0" : -0.15, 
      '0.5': -0.075,
      "1" : 0,
      "1.5" : 0,
      "2" : 0.15,
      "2.5" : 0.18,
      "3" : 0.2,
      "3.5" : 0.22,
      "4" : 0.25,
      "5" : 0.3,
      "6" : 0,

    }}

    static get PALETTE_INFO() { return {
      'mobileUnzoomed': {
        offsetX: 26,
        spaceX: 30,
        row1Y: 10,
        row2Y: 38,
        bigY: 28,
        bigX1: 16,
        bigX2: 306,
        smolRadius: 12,
        bigRadius: 22,
      },

      '1': {
        offsetX: 13,
        spaceX: 15,
        row1Y: 5,
        row2Y: 19,
        bigY: 14,
        bigX1: 8,
        bigX2: 153,
        smolRadius: 6,
        bigRadius: 11,
      },

      "3" : {
        offsetX: 8,
        spaceX: 8,
        row1Y: 4,
        row2Y: 9,
        bigY: 7,
        bigX1: 4,
        bigX2: 84,
        smolRadius: 4,
        bigRadius: 6,
      },

      "6" : {
        offsetX: 5,
        spaceX: 5,
        row1Y: 2,
        row2Y: 5,
        bigY: 4,
        bigX1: 2,
        bigX2: 51,
        smolRadius: 2,
        bigRadius: 4,
      }

    }}

  }
