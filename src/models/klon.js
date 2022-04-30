import Const from './constants';
import { importedChunks } from '../utils/web3';
import { animateRune } from '../utils/runeAnims';

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
        this.transitionType;
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
        if (this.transitionType === 'erase') {
            // erase
            if (this.transitionCount === 1) this.color = [0, 118, 255];
            else this.color = this.avg(this.target, this.color, 8);

            if (this.transitionCount === 10) this.endTransition();
        } else if (this.transitionType === 'draw') {
            // draw
            if (this.transitionCount === 1) this.color = [254, 1, 255];
            else if (this.transitionCount === 2) this.color = [255, 116, 139];
            else if (this.transitionCount === 3) this.color = [255, 246, 10];
            else if (this.transitionCount === 4) this.color = [158, 255, 97];
            else if (this.transitionCount === 5) this.color = [16, 255, 239];
            else if (this.transitionCount === 6) this.color = [108, 147, 255];
            else this.color = this.avg(this.target, this.color, 1);

            //prettier-ignore
            if (this.transitionCount === 10) {this.endTransition(); return}
        } else if (this.transitionType === 'import') {
            // import
            const rand = Math.random() * 20;
            if (this.transitionCount === 1) {
                animateRune(this.zIndex);
                this.color = Const.DEFAULT_COLOR;
            } else if (this.transitionCount === 2) this.color = Const.DEFAULT_COLOR;
            else if (this.transitionCount === 3) this.color = [88, 141, 190];
            else if (this.transitionCount === 5) this.color = [132, 172, 228];
            else if (this.transitionCount === 7) this.color = [166, 252, 219];
            else if (this.transitionCount === 9) this.color = [88, 141, 190];
            else if (this.transitionCount === 11) this.color = [166, 252, 219];
            else if (this.transitionCount === 13) this.color = [132, 172, 228];
            else if (this.transitionCount === 15) this.color = [88, 141, 190];
            else if (this.transitionCount > 15) this.color = this.avg(this.target, this.color, 5);
            //prettier-ignore
            if (this.transitionCount === 22) {this.endTransition(); return}
        } else if (this.transitionType === 'whiteOnRune') {
            // whiteOnRune
            if (this.transitionCount === 97) {
                this.target = this.color;
                this.color = [255, 255, 255];
            } else if (this.transitionCount === 100) {
                this.endTransition();
                return;
            }
        } else if (this.transitionType === 'runeBlueAnim') {
            //runeBlueAnim
            if (this.transitionCount === 1) this.color = [32, 214, 199];
            else if (this.transitionCount < 10) this.color = [32, 214, 199];
            else this.color = this.avg(this.target, this.color, 10);
            //prettier-ignore
            if (this.transitionCount === 50) {this.endTransition(); return}
        } else if (this.transitionType === 'runeContour') {
            //runeContour
            if (this.transitionCount === 1) this.color = [10, 10, 10];
            else if (this.transitionCount < 10) this.color = [10, 10, 10];
            else this.color = this.avg(this.target, this.color, 10);
            //prettier-ignore
            if (this.transitionCount === 50) {this.endTransition(); return}
        }

        this.transitionCount++;
    }

    setTargetColor(target, zIndex) {
        if (zIndex === 0) this.transitionType = 'draw';
        else if (zIndex === undefined) this.transitionType = 'erase';
        else if (zIndex >= 0) {
            // Condition pour animer le chunk
            this.transitionType = 'import';
        } else if (zIndex > 0) this.color = target;
        else console.log('autre zIndex', zIndex);

        this.zIndex = zIndex;
        this.target = target;

        if (this.transitionCount + 1 !== 10) this.transitionCount++;
    }

    endTransition() {
        this.color = this.target;
        this.transitionType = undefined;
        this.transitionCount = 0;
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
