<template>
  <div></div>
</template>

<script>
import UPNG from "upng-js";

export default {
  name: "PixelGrid",
  props: {
    currentColor: Object,
  },
  components: {},
  data() {
    return {
      grid_data: [],
    };
  },
  methods: {
    load() {
      if (localStorage.getItem("grid_data")) {
        return JSON.parse(localStorage.getItem("grid_data"));
      }
      return [];
    },
    save(new_data) {
      localStorage.setItem("grid_data", JSON.stringify(new_data));
    },
  },
  mounted() {
    var grid = require("pixel-grid");
    var position = require("mouse-position");
    var UPNG = require("upng-js");

    document.body.style.transition = "0.3s all";

    var rows = 256;
    var columns = 128;

    var data = []; // array du dessous (noise)
    var persistentData = this.load(); // array du dessus
    var fillPersitent = false;
    var pixelDrawnCounter = 0

    if (persistentData.length == 0) fillPersitent = true; // est-ce qu'il existe une sauvegarde, si non, tableau vide instancié

    window.addEventListener("beforeunload", () => {
      this.save(persistentData);
    });

    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < columns; j++) {
        data.push([0, 0, 0]);
        if (fillPersitent) persistentData.push([[0, 0, 0], 0]); //[color, valeur author]
      }
    }

    var pixels = grid(data, {
      // settings de la librairie grille pixel
      root: document.body,
      rows: rows,
      columns: columns,
      size: 15,
      padding: 1,
      background: [0, 0, 0],
      formatted: true,
    });

    var mouse = position(pixels.canvas);
    var klonX, klonY, rand;

    var toggleDraw = false;
    document.body.addEventListener("mousedown", () => {
      toggleDraw = true;
    });
    document.body.addEventListener("mouseup", () => {
      toggleDraw = false;
      console.log(`Facture : ${pixelDrawnCounter * 3}`)
    });

    function XY2Number(x, y)
    {
      let number = y * columns + x
      // console.log(`Klon #${number} => x : ${x} | y : ${y}`)
      return number
    }

    function number2XY(number)
    {
      let number2x = number % columns
      let number2y = Math.floor(number / columns)
      // console.log(`Klon #${number} => x : ${number2x} | y : ${number2y}`)
      return [number2x, number2y]
    }

    // klonHex(3, 9)
    function klonHex(x, y)        //prends un Klon @ x,y et retourne sa valeur RGBA
    {
      let r = persistentData[XY2Number(x, y)][0][0]
      let g = persistentData[XY2Number(x, y)][0][1]
      let b = persistentData[XY2Number(x, y)][0][2]
      r = (r * 255).toString(16)
      g = (g * 255).toString(16)
      b = (b * 255).toString(16)
      let output = r + g + b + 'FF'
      return output
    }

    function clearGrid() 
    {
      for (i = 0; i < persistentData.length; i++) {
        persistentData[i][0][0] = 0;
        persistentData[i][0][1] = 0;
        persistentData[i][0][2] = 0;
        persistentData[i][1] = 0;
      }
      pixelDrawnCounter = 0
    }

    function mousePosOnGrid() 
    {
      var screenx = document.documentElement.clientWidth;
      var screeny = document.documentElement.clientHeight;
      var pixelSize = screenx / columns;
      var nbPixely = screeny / pixelSize;
      klonX = Math.floor((mouse[0] / screenx) * columns);
      klonY = Math.floor((mouse[1] / screeny) * nbPixely);
    }

    function pen(color) 
    {
      mousePosOnGrid();
      if (klonX < columns && klonY < rows) {
        draw_pixel(klonX, klonY, color, 1);
      }
    }

    function eraser() {
      mousePosOnGrid();
      if (klonX < columns && klonY < rows) {
        erase_pixel(klonX, klonY);
      }
    }

    var toolCode = 0                      //PEN = 0, GOMME = 1, TEXT = 2                                  <<<<<<<<<<||||||||||||||||||||||||||||||||||||||||||||||||
    function currentTool(color) {
      switch (toolCode) {
        case 0:
          pen(color);
          break;
        case 1:
          eraser();
          break;
        case 2:
          text();
          break;
      }
    }

    function draw_pixel(x, y, color, author) {
      var pos = y * columns + x;
      color = to_color_array(color);
      if (persistentData[pos][1] != 2){
         if (persistentData[pos][1] == 0) pixelDrawnCounter++
      persistentData[pos][0] = color;
      persistentData[pos][1] = author; //marqueur "author"
      }
    }

    function erase_pixel(x, y) 
    {
      var pos = y * columns + x;
      if (persistentData[pos][1] == 1){
      persistentData[pos][0] = [0, 0, 0];
      persistentData[pos][1] = 0; //marqueur "author"
      pixelDrawnCounter--
      }
    }

    function to_color_array(color) 
    {
      color = color.rgba;
      color = [color.r / 255, color.g / 255, color.b / 255];
      return color;
    }

    function getHighLow() 
    {
      let lowX = persistentData.length, lowY = persistentData.length, highX = 0, highY = 0
      for (let i = 0; i < persistentData.length; i++) 
      {
        if(persistentData[i][1] == 1){
          if(number2XY(i)[0] < lowX){lowX = number2XY(i)[0]}
          if(number2XY(i)[0] > highX){highX = number2XY(i)[0]}
          if(number2XY(i)[1] < lowY){lowY = number2XY(i)[1]}
          if(number2XY(i)[1] > highY){highY = number2XY(i)[1]}
        }
      }
      console.log(`lowX : ${lowX} | lowY : ${lowY} | highX : ${highX} | highY : ${highY} | `)
      return [lowX, lowY, highX, highY] 
    }

    function saveGuy()
    {
      let highLow = getHighLow()
      let longueur = highLow[2] - highLow[0] + 1
      let largeur = highLow[3] - highLow[1] + 1
      console.log(`Longueur : ${longueur} | Largeur : ${largeur}`)
      let saveArray = []
      // saveArray = new Uint8Array(saveArray)
      for (let i = 0; i < persistentData.length; i++) {
        if(number2XY(i)[0] >= highLow[0] && number2XY(i)[0] <= highLow[2] && number2XY(i)[1] >= highLow[1] && number2XY(i)[1] <= highLow[3]){
          if(persistentData[i][1] == 1){
            saveArray.push(persistentData[i][0][0] * 255)
            saveArray.push(persistentData[i][0][1] * 255)
            saveArray.push(persistentData[i][0][2] * 255)
            saveArray.push(255)
          }else{
            saveArray.push(0)
            saveArray.push(0)
            saveArray.push(0)
            saveArray.push(0)
          }
        }
      }
      console.log('SAVE ARRAY')
      console.log(saveArray)
      saveImage(saveArray, longueur, largeur)
    }
    // clearGrid()
    
    saveGuy()

    function draw_persistent_data() {
      // REDRAW GRILLE DU DESSUS
      for (var i = 0; i < data.length; i++) {
        if (persistentData[i][1] != 0) data[i] = persistentData[i][0];
      }
    }

    function draw_noise() {
      for (var i = 0; i < data.length; i++) {
        rand = Math.random() * 0.02;
        data[i] = [
          data[i][0] * 0.95 + rand,
          data[i][1] * 0.95 + rand,
          data[i][2] * 0.95 + rand,
        ];
      }
    }

    var array = []
    function loadImage(imgURL, offsetx, offsety) {
      //ajouter nbPixel en entrée

      fetch(imgURL)
        .then((res) => res.blob())
        .then((blob) => {
          blob.arrayBuffer().then((buffer) => {
            var buff = UPNG.decode(buffer);
            array = buff.data;
            // console.log(array)
            var oWidth = buff.width
            var oHeight = buff.height

            for (let y = 0; y < oWidth; y++) {
              for (let x = 0; x < oHeight; x++) {
                let idx = (oWidth * y + x) * 4;
                if (array[idx + 3] != 0)
                  draw_pixel(x + offsetx, y + offsety, {rgba: {r: array[idx],g: array[idx + 1],b: array[idx + 2]}}, 2);
              }
            }
          // saveImage(array, oHeight, oWidth);
          }).then(() => { // on attends que l'upload soit fini et on save l'image
          // saveImage(array, oHeight, oWidth);
          });
        })
    }

    loadImage("https://i.imgur.com/qAhwWr9.png", 20, 15); //image bonhomme
    loadImage("https://i.imgur.com/Lbd2bji.png", 170, 10); //image test 3x3 
    loadImage("https://i.imgur.com/iWJ9P2S.png", 140, 7); //image test 3x3 n2
    loadImage("https://i.imgur.com/Eq4ajRS.png", 120, 5); //image test 4x4
    loadImage("https://i.imgur.com/bAInSyz.png", 12, 15); //image test 5x5

    function _arrayBufferToBase64( buffer ) { // fonction pour encoder en base 64 pour pouvoir télécharger l'image ensuite
      var binary = '';
      var bytes = new Uint8Array( buffer );
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
      }
      return window.btoa( binary );
    }

    function saveImage(inputArray, height, width)
    {
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



    var component = this; // pour recuperer couleur quelques lignes plus loin

    pixels.frame(function () {
      //appelé à chaque frame (60 fois par seconde)
      draw_noise();
      if (toggleDraw) currentTool(component.currentColor);
      draw_persistent_data();
      pixels.update(data);
    });

    pixels.canvas.style.width = "100%";
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>