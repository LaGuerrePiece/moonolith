/**
 * Classe d'un pixel nommé "klon" de la Grille
 */
export default class Klon {
    /**
     * Constructeur d'un klon
     * @param {la couleur du pixel/klon (array/string/number)} color
     * @param {le zIndex du klon, qui détermine la priorité d'affichage. 0 pour utilisateur} zIndex
     * @param {le type du klon : monolith, landscape, GUI} type
     * @param {l'index du klon au sein du monolith} index
     */
    constructor(color, zIndex, type, index) {
        this.color = color;
        this.zIndex = zIndex;
        this.type = type;
        this.index = index;
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
        return zIndex ? this.zIndex >= zIndex : !this.zIndex;
    }

    static get USERPAINTED() {
        return 0;
    }
}
