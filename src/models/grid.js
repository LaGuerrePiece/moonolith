import Klon from './klon';

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
        if (this.persistent[pos] ? this.persistent[pos].isEditable(zIndex) : true) this.persistent[pos] = klon;
    }

    get_color(x, y, grid) {
        let pos = y * this.nbColumns + x;
        if (this.persistent[pos] !== undefined) {
            return this.persistent[pos].color;
        }
    }

    delete_user_pixel() {
        for (let pos = 0; pos < this.persistent.length; pos++) {
            if (this.persistent[pos] && !this.persistent[pos].zIndex) this.persistent[pos] = undefined;
        }
    }

    erase_pixel(x, y) {
        let pos = y * this.nbColumns + x;
        if (this.persistent[pos] ? !this.persistent[pos].zIndex : true) this.persistent[pos] = undefined;
    }

    convertIndexToXY(number) {
        let x = number % this.nbColumns;
        let y = Math.floor(number / this.nbColumns);
        return { x, y };
    }

    convertXYToIndex(x, y) {
        return y * this.nbColumns + x;
    }

    // addRow() {
    //     this.persistent.unshift(...Array(this.nbColumns).fill(undefined));
    //     this.noises.unshift(...Array(this.nbColumns).fill(new Klon([0, 0, 0])));
    //     this.viewPos++;
    // }
}
