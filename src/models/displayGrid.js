import pixelgrid from 'pixel-grid';

/**
 * Classe de la Grille d'affichage
 */
export default class DisplayGrid {
    /**
     * Le constructeur de la classe Grid
     * @param {nombre de colonnes pour la grille} nbColumns
     * @param {nombre de ligne pour la grille} nbRows
     * @param {les options pour pixel-grid} options
     * @throws {erreur si dimensions non transmises}
     */
    constructor(
        nbColumns,
        nbRows,
        options = {
            size: 15,
            padding: 1,
            background: [0, 0, 0],
            formatted: true,
        }
    ) {
        if (!nbColumns || !nbRows) throw new Error('Grid constructor needs number of columns and rows');
        this.nbColumns = nbColumns;
        this.nbRows = nbRows;
        this.options = options;

        // la future instance de PixelGrid
        this.pixels = null;

        // les futures datas de PixelGrid
        this.initialData = Array.from({ length: this.length }, () => [1, 1, 1]);
    }

    /**
     * Getter permettant de récupérer la taille du tableau
     * @returns {le facteur du nombre de colonnes et lignes}
     */
    get length() {
        return this.nbColumns * this.nbRows;
    }

    /**
     * Initialise PixelGrid
     * @param {l'élement du DOM dans lequel est affiché pixel} root
     */
    initialize(root, width = '100%') {
        this.pixels = pixelgrid(this.initialData, {
            rows: this.nbRows,
            columns: this.nbColumns,
            root,
            ...this.options,
        });
        this.pixels.canvas.style.width = width;
    }

    updateDisplay(data) {
        this.pixels.update(data);
    }
}
