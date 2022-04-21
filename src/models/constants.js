//prettier-ignore
export default class Const { 

    static get COLUMNS() { return 256 }
    static get LINES() { return 560 }
    static get MONOLITH_COLUMNS() { return this.COLUMNS - this.MARGIN_LEFT - this.MARGIN_RIGHT }
    static get MONOLITH_LINES() { return this.LINES - this.MARGIN_TOP - this.MARGIN_BOTTOM }


    static get MARGIN_TOP() { return 54 }
    static get MARGIN_BOTTOM() { return 30 }
    static get MARGIN_LEFT() { return 47 }
    static get MARGIN_RIGHT() { return 60 }


    // COLORS

    static get HEX1() { return '#fff7e4' }
    static get HEX2() { return '#6c5671' }
    static get HEX3() { return '#d9c8bf' }
    static get HEX4() { return '#f98284' }
    static get HEX5() { return '#b0a9e4' }
    static get HEX6() { return '#accce4' }
    static get HEX7() { return '#b3e3da' }
    static get HEX8() { return '#feaae4' }
    static get HEX9() { return '#87a889' }
    static get HEX10() { return '#b0eb93' }
    static get HEX11() { return '#e9f59d' }
    static get HEX12() { return '#ffe6c6' }
    static get HEX13() { return '#dea38b' }
    static get HEX14() { return '#ffc384' }
    static get HEX15() { return '#fff7a0' }
    static get HEX16() { return '#28282e' }

    static get RGB1() { return [1, 0.9686, 0.8941] }
    static get RGB2() { return [0.4235, 0.33725, 0.44313] }
    static get RGB3() { return [0.8509, 0.7843, 0.7490] }
    static get RGB4() { return [0.9764, 0.5098, 0.5176] }
    static get RGB5() { return [0.6901, 0.6627, 0.8941]}
    static get RGB6() { return [0.6745, 0.8, 0.8941]}
    static get RGB7() { return [0.7019, 0.8901, 0.8549]}
    static get RGB8() { return [0.996, 0.667, 0.8941]}
    static get RGB9() { return [0.5294, 0.6588, 0.5372]}
    static get RGB10() { return [0.6901, 0.9215, 0.5764]}
    static get RGB11() { return [0.9137, 0.9607, 0.6156]}
    static get RGB12() { return [1, 0.9019, 0.7764]}
    static get RGB13() { return [0.8705, 0.6392, 0.5450]}
    static get RGB14() { return [1, 0.7647, 0.5176]}
    static get RGB15() { return [1, 0.9686, 0.6274]}
    static get RGB16() { return [0.1568, 0.1568, 0.1803]} // SAME AS DEFAULT_COLOR

    static get DEFAULT_COLOR() { return [0.1568, 0.1568, 0.1803] }
    static get SKY_COLOR() { return [0.2902, 0.6431, 0.6549] }


    static get PALETTE() { return [this.COLOR1, this.COLOR2, this.COLOR3, this.COLOR4, this.COLOR5, this.COLOR6, this.COLOR7, this.COLOR8, this.COLOR9, this.COLOR10, this.COLOR11, this.COLOR12, this.COLOR13, this.COLOR14, this.COLOR15, this.COLOR16] }
    
}
