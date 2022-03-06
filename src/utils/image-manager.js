import UPNG from "upng-js"
import Klon from "../models/klon"

function decode(buffer) {
    return new Promise(resolve => {
        let buff = UPNG.decode(buffer)
        resolve(buff)
    })
}

function getHighLow(grid) {
    let lowX = grid.persistent.length,
        lowY = grid.persistent.length,
        highX = 0,
        highY = 0


        for (let i in grid.persistent) {
        if (grid.persistent[i].author == Klon.PAINTED) {
            if (grid.convertIndexToXY(i).x < lowX) { lowX = grid.convertIndexToXY(i).x }
            if (grid.convertIndexToXY(i).x > highX) { highX = grid.convertIndexToXY(i).x }
            if (grid.convertIndexToXY(i).y < lowY) { lowY = grid.convertIndexToXY(i).y }
            if (grid.convertIndexToXY(i).y > highY) { highY = grid.convertIndexToXY(i).y }
        }
    }
    let longueur = highX - lowX + 1
    let largeur = highY - lowY + 1
    // console.log(`lowX : ${lowX} | lowY : ${lowY} | highX : ${highX} | highY : ${highY} | `)
    return { lowX, lowY, highX, highY, longueur, largeur }
}

function preEncode(grid) {
    return new Promise(resolve => {
        let highLow = getHighLow(grid)
        let saveArray = []
        let nbPix = 0
        let firstPix = -1
        for (let i = grid.convertXYToIndex(highLow.lowX, highLow.lowY); i <= grid.convertXYToIndex(highLow.highX, highLow.highY); i++) {          
            if (grid.convertIndexToXY(i).x >= highLow.lowX && grid.convertIndexToXY(i).x <= highLow.highX &&
                grid.convertIndexToXY(i).y >= highLow.lowY && grid.convertIndexToXY(i).y <= highLow.highY) {
                if (grid.persistent[i] && grid.persistent[i].author == Klon.PAINTED) {
                    if (firstPix == -1) firstPix = i
                    saveArray.push(grid.persistent[i].color[0] * 255)
                    saveArray.push(grid.persistent[i].color[1] * 255)
                    saveArray.push(grid.persistent[i].color[2] * 255)
                    saveArray.push(255)
                    nbPix++
                } else {
                    saveArray.push(0)
                    saveArray.push(0)
                    saveArray.push(0)
                    saveArray.push(0)
                }
            }
        }
        // saveArray = saveArray.slice(0, (highLow.longueur * highLow.largeur * 4))
        saveArray = new Uint8Array(saveArray)
        var png = UPNG.encode([saveArray.buffer], highLow.longueur, highLow.largeur, 0); // on encode    
        let buffer = _arrayBufferToBase64(png) //on passe au format base64
        var elementA = document.createElement('a'); //On crée un element vide pour forcer le téléchargement
        elementA.setAttribute('href', 'data:image/png;base64,' + buffer); // on met les données au bon format (base64)
        elementA.setAttribute('download', +new Date() + ".png"); // le nom du fichier
        elementA.style.display = 'none'; // on met l'elem invisible
        document.body.appendChild(elementA); //on crée l 'elem
        elementA.click(); // on télécharge
        document.body.removeChild(elementA); // on delete l'elem
        console.log('highLow.lowX, highLow.lowY', highLow.lowX, highLow.lowY)
        console.log('RETOUR DE TOUR :', 'POSITION :', firstPix, 'YMAX:', highLow.highY, 'NBPIX', nbPix, 'BUFFER', buffer)

        resolve({ position: firstPix, ymax: highLow.highY, nbPix: nbPix, imgURI: buffer})
    })
}

function _arrayBufferToBase64(buffer) { // fonction pour encoder en base 64 pour pouvoir télécharger l'image ensuite
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function Encode(inputArray, height, width) {
    inputArray = new Uint8Array(inputArray) //on passe au format 8 bit
    const sliced = new Uint8Array(inputArray.slice(0, (height * width * 4)));
    var png = UPNG.encode([sliced.buffer], height, width, 0); // on encode
    console.log('image saved!')
    let buffer = _arrayBufferToBase64(png) //on passe au format base64
    console.log(buffer)
    var elementA = document.createElement('a'); //On crée un element vide pour forcer le téléchargement
    elementA.setAttribute('href', 'data:image/png;base64,' + buffer); // on met les données au bon format (base64)
    elementA.setAttribute('download', +new Date() + ".png"); // le nom du fichier
    elementA.style.display = 'none'; // on met l'elem invisible
    document.body.appendChild(elementA); //on crée l 'elem
    elementA.click(); // on télécharge
    document.body.removeChild(elementA); // on delete l'elem
}



export {
    decode,
    getHighLow,
    preEncode
}