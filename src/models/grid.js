import Klon from './klon';
import { addToCurrentEvent, closeCurrentEvent } from '../models/stack';

/**
 * Classe de la Grille
 */
export default class Grid {
    /**
     * Le constructeur de la classe Grid
     * @param {nombre de colonnes pour la grille} nbColumns
     * @param {nombre de ligne pour la grille} nbRows
     * @throws {erreur si dimensions non transmises}
     */
    constructor(nbColumns, nbRows) {
        if (!nbColumns || !nbRows) throw new Error('Grid constructor needs number of columns and rows');
        this.nbColumns = nbColumns;
        this.nbRows = nbRows;

        // Initialisation des tableaux avec le noise (en-dessous) et les dessins au-dessus
        this.noises = Array.from({ length: 19040 }, () => new Klon([0, 0, 0]));
        this.persistent = new Array(19040);
    }

    /**
     * Getter permettant de récupérer le tableau de pixels
     * @returns {le tableau de pixels persistant}
     */
    getPersistent() {
        return this.persistent;
    }

    draw_pixel(x, y, zIndex, klon) {
        let pos = y * this.nbColumns + x;
        if (pos > 0 && pos < this.persistent.length) {
            if (this.persistent[pos] ? this.persistent[pos].isEditable(zIndex) : true) {
                if (!this.klonsAreEqual(this.persistent[pos], klon)) {
                    if (zIndex === 0) addToCurrentEvent(pos, this.persistent[pos]);
                    this.persistent[pos] = klon;
                }
            }
        }
    }

    get_color(x, y, grid) {
        let pos = y * this.nbColumns + x;
        if (this.persistent[pos] !== undefined) {
            return this.persistent[pos].color;
        }
    }

    erase_all_pixel() {
        for (let pos = 0; pos < this.persistent.length; pos++) {
            if (this.persistent[pos] && !this.persistent[pos].zIndex) {
                addToCurrentEvent(pos, this.persistent[pos]);
                this.persistent[pos] = undefined;
            }
        }
        closeCurrentEvent();
    }

    erase_pixel(x, y) {
        let pos = y * this.nbColumns + x;
        if (this.persistent[pos] ? !this.persistent[pos].zIndex : true) {
            if (this.persistent[pos]) addToCurrentEvent(pos, this.persistent[pos]);
            this.persistent[pos] = undefined;
        }
    }

    convertIndexToXY(number) {
        let x = number % this.nbColumns;
        let y = Math.floor(number / this.nbColumns);
        return { x, y };
    }

    convertXYToIndex(x, y) {
        return y * this.nbColumns + x;
    }

    addRow(numberOfRow) {
        this.nbRows += numberOfRow;
    }

    klonsAreEqual(klon1, klon2) {
        return (
            klon1?.color[0] == klon2?.color[0] &&
            klon1?.color[1] == klon2?.color[1] &&
            klon1?.color[2] == klon2?.color[2] &&
            klon1?.zIndex == klon2?.zIndex
        );
    }
}
