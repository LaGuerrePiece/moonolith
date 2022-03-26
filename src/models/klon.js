/**
 * Classe d'un pixel nommé "klon" de la Grille
 */
export default class Klon {
    /**
     * Constructeur d'un klon
     * @param {la couleur du pixel/klon (array/string/number)} color
     * @param {le mode du klon = 0 pour libre, 1 pour l'utilisateur et 2 inaltérable } author
     */
    constructor(color, author) {
        this.color = color;
        this.author = author;
    }

    /**
     * Permet de mettre une nuance de gris aléatoire
     */
    randGray(rand) {
        this.color[0] = this.color[0] * 0.95 + rand;
        this.color[1] = this.color[1] * 0.95 + rand;
        this.color[2] = this.color[2] * 0.95 + rand;
        return this;
    }

    get isEditable() {
        return this.author !== Klon.PAID;
    }

    static get FREE() {
        return 0;
    }
    static get PAINTED() {
        return 1;
    }
    static get PAID() {
        return 2;
    }
}
