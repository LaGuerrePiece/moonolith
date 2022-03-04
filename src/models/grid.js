import pixelgrid from "pixel-grid";
import Klon from "./klon";

/**
 * Classe de la Grille
 */
export default class Grid {

    /**
     * Le constructeur de la classe Grid
     * @param {nombre de colonnes pour la grille} nbColumns 
     * @param {nombre de ligne pour la grille} nbRows 
     * @param {les options pour } options 
     * @throws {erreur si dimensions non transmises}
     */
    constructor(
        nbColumns,
        nbRows,
        options = {
            size: 15,
            padding: 1,
            background: [0, 0, 0],
            formatted: true
        }
    ) {
        if(!nbColumns || !nbRows) throw new Error("Grid constructor needs number of columns and rows")
        this.nbColumns = nbColumns
        this.nbRows = nbRows
        this.options = options

        this.pixels = null

        this.noises = Array.from({ length: this.length }, () => new Klon([0, 0, 0]));
        this.persistent = new Array(this.length)
    }

    /**
     * Getter permettant de récupérer la taille du tableau
     * @returns {le facteur du nombre de colonnes et lignes}
     */
    get length() {
        return this.nbColumns * this.nbRows
    }

    /**
     * Initialise PixelGrid 
     * @param {l'élement du DOM dans lequel est affiché pixel} root 
     */
    initialize(root) {
        this.pixels = pixelgrid(this.noises.map(klon => klon.color), {
            rows: this.nbRows,
            columns: this.nbColumns,
            root,
            ...this.options,
        });
        this.pixels.canvas.style.width = "100%";
        this.pixels.frame(() => {
            this.draw_noise()
            this.pixels.update(this.noises.map(klon => klon.color))
        })
    }

    update(pixels) {
        // this.pixels.update(pixels)
    }

    draw_noise() {
        this.noises.forEach(klon => {
            klon.randGray()
        })
    }

}

