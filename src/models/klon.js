import Const from './constants';

/**
 * Classe d'un pixel nommé "klon" de la Grille
 */
export default class Klon {
    /**
     * Constructeur d'un klon
     * @param {la couleur du pixel/klon (array/string/number)} color
     * @param {le zIndex du klon, qui détermine la priorité d'affichage. 0 pour utilisateur} zIndex
     */
    constructor(color, zIndex) {
        this.color = color;
        this.zIndex = zIndex;
        this.target = color;
        this.transitionCount = 0;
    }

    /**
     * Permet de mettre une nuance de gris aléatoire
     */
    randGray(rand) {
        this.color[0] = this.color[0] * 0.93 + rand;
        this.color[1] = this.color[1] * 0.93 + rand;
        this.color[2] = this.color[2] * 0.96 + rand;
        return this;
    }
    /**
     * Rend true si le klon est éditable, false sinon
     */
    isEditable(zIndex) {
        if (this.zIndex == Klon.USERPAINTED || this.zIndex == undefined) return true;
        if (zIndex == Klon.USERPAINTED) return this.zIndex <= zIndex;
        return this.zIndex >= zIndex;
    }

    avg(color1, color2, weightOf2 = 1) {
        return [
            (color1[0] + color2[0] * weightOf2) / (1 + weightOf2),
            (color1[1] + color2[1] * weightOf2) / (1 + weightOf2),
            (color1[2] + color2[2] * weightOf2) / (1 + weightOf2),
        ];
    }

    transition() {
        if (
            this.target[0] === Const.DEFAULT_COLOR[0] &&
            this.target[1] === Const.DEFAULT_COLOR[1] &&
            this.target[2] === Const.DEFAULT_COLOR[2]
        ) {
            //ERASE
            if (this.transitionCount % 10 === 1) this.color = [0, 118, 255];
            else this.color = this.avg(this.target, this.color, 8);
            this.transitionCount++;
            if (this.transitionCount % 10 === 0) this.color = this.target;
        } else {
            //DRAW
            if (this.transitionCount % 10 === 1) this.color = [254, 1, 255];
            else if (this.transitionCount % 10 === 2) this.color = [255, 116, 139];
            else if (this.transitionCount % 10 === 3) this.color = [255, 246, 10];
            else if (this.transitionCount % 10 === 4) this.color = [158, 255, 97];
            else if (this.transitionCount % 10 === 5) this.color = [16, 255, 239];
            else if (this.transitionCount % 10 === 6) this.color = [108, 147, 255];
            else this.color = this.avg(this.target, this.color, 1);
            this.transitionCount++;
            if (this.transitionCount % 10 === 0) this.color = this.target;
        }
    }

    setTargetColor(color) {
        this.target = color;
        this.transitionCount++;
        // console.log('set target color to ', color);
    }

    static get USERPAINTED() {
        return 0;
    }
}

// Save 1
// avg(color1, color2) {
//     return [(color1[0] + color2[0]) / 2, (color1[1] + color2[1]) / 2, (color1[2] + color2[2]) / 2];
// }
// transition(rand) {
//     this.color = this.avg(this.color, Const.PALETTE[(rand * Const.PALETTE.length) | 0]);
//     this.transitionCount++;
// }

// Save 2
// this.color = this.avg(this.color, Const.PALETTE[(rand * Const.PALETTE.length) | 0]);
// this.color = this.avg(this.target, this.color);

//this.color = this.avg(this.target, this.rand);
// if (this.transitionCount % 20 === 1) this.color = Const.PALETTE[(rand * Const.PALETTE.length) | 0];
// if (this.transitionCount % 20 === 1) this.color = Const.RANDOM_COLOR;

// if (this.transitionCount === 1) this.color = Const.DEFAULT_COLOR;
// else if (this.transitionCount < 10) {
//     this.color = this.avg(this.color, [255, 0, 0], 0.1);
// } else {
//     this.color = this.avg(this.target, this.color, 1);
// }

// if (this.transitionCount === 20) this.color = this.target;

// this.color[0] += (this.target[0] - this.color[0]) / 20;
// this.color[1] += (this.target[1] - this.color[1]) / 20;
// this.color[2] += (this.target[2] - this.color[2]) / 5;

// if (this.transitionCount % 20 === 1) this.color = Const.PALETTE[(rand * Const.PALETTE.length) | 0];
// this.color = this.avg(this.target, this.color, 5);
// if (this.transitionCount % 10 === 0) this.color = this.target;
// this.transitionCount++;

// if (this.transitionCount % 20 === 1) this.color = [200, 0, 0];
// else if (this.transitionCount % 20 === 2) this.color = [0, 200, 0];
// else if (this.transitionCount % 20 === 3) this.color = [0, 0, 200];
// else if (this.transitionCount % 20 === 4) this.color = [200, 200, 0];
// else if (this.transitionCount % 20 === 5) this.color = [0, 200, 200];
// else if (this.transitionCount % 20 === 6) this.color = [200, 0, 200];
// else this.color = this.avg(this.target, this.color, 1);
// if (this.transitionCount % 10 === 0) this.color = this.target;
