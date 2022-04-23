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

    static get RGB1() { return [
      1,
      0.9686274509803922,
      0.8941176470588236
    ] } // #fff7e4
    static get RGB2() { return [
      0.4235294117647059,
      0.33725490196078434,
      0.44313725490196076
    ] } // #6c5671
    static get RGB3() { return [
      0.8509803921568627,
      0.7843137254901961,
      0.7490196078431373
    ] } // #d9c8bf
    static get RGB4() { return [
      0.9764705882352941,
      0.5098039215686274,
      0.5176470588235295
    ] } // #f98284
    static get RGB5() { return [
      0.6901960784313725,
      0.6627450980392157,
      0.8941176470588236
    ] } // #b0a9e4
    static get RGB6() { return [
      0.6745098039215687,
      0.8,
      0.8941176470588236
    ]} // #accce4
    static get RGB7() { return [
      0.7019607843137254,
      0.8901960784313725,
      0.8549019607843137
    ] } // #b3e3da
    static get RGB8() { return [
      0.996078431372549,
      0.6666666666666666,
      0.8941176470588236
    ] } // #feaae4
    static get RGB9() { return [
      0.5294117647058824,
      0.6588235294117647,
      0.5372549019607843
    ] } // #87a889
    static get RGB10() { return [
      0.6901960784313725,
      0.9215686274509803,
      0.5764705882352941
    ] } // #b0eb93
    static get RGB11() { return [
  0.9137254901960784,
  0.9607843137254902,
  0.615686274509804
]} // #e9f59d
    static get RGB12() { return [
      1,
      0.9019607843137255,
      0.7764705882352941
    ]} // #ffe6c6
    static get RGB13() { return [
      0.8705882352941177,
      0.6392156862745098,
      0.5450980392156862
    ]} // #dea38b
    static get RGB14() { return [
      1,
      0.7647058823529411,
      0.5176470588235295
    ] } // #ffc384
    static get RGB15() { return [
      1,
      0.9686274509803922,
      0.6274509803921569
    ]} // #fff7a0
    static get RGB16() { return [
      0.1568627450980392,
      0.1568627450980392,
      0.1803921568627451
    ] } // #28282e SAME AS DEFAULT_COLOR

    static get DEFAULT_COLOR() { return [0.1568, 0.1568, 0.1803] } // #28282e
    static get SKY_COLOR() { return [0.2902, 0.6431, 0.6549] }  // #4d8c9e


    static get PALETTE() { return [this.RGB1, this.RGB2, this.RGB3, this.RGB4, this.RGB5, this.RGB6, this.RGB7, this.RGB8, this.RGB9, this.RGB10, this.RGB11, this.RGB12, this.RGB13, this.RGB14, this.RGB15, this.RGB16] }
    
  }
