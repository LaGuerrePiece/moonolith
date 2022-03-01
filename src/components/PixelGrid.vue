<template>
  <div></div>
</template>

<script>
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

    var rows = 90;
    var columns = 60;

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
      // console.log(number2XY(65) + '\n' + XY2Number(5, 1))
    });
    document.body.addEventListener("mouseup", () => {
      toggleDraw = false;
      console.log(`Facture : ${pixelDrawnCounter * 3}`)
    });

    function XY2Number(x, y)
    {
      let number = y * columns + x
      console.log(`Klon #${number} => x : ${x} | y : ${y}`)
      return number
    }

    function number2XY(number)
    {
      let number2x = number % columns
      let number2y = Math.floor(number / columns)
      // console.log(`Klon #${number} => x : ${number2x} | y : ${number2y}`)
      return [number2x, number2y]
    }


    function clearGrid() {
      for (i = 0; i < persistentData.length; i++) {
        persistentData[i][0][0] = 0;
        persistentData[i][0][1] = 0;
        persistentData[i][0][2] = 0;
        persistentData[i][1] = 0;
      }
      pixelDrawnCounter = 0
    }


    function mousePosOnGrid() {
      var screenx = document.documentElement.clientWidth;
      var screeny = document.documentElement.clientHeight;
      var pixelSize = screenx / columns;
      var nbPixely = screeny / pixelSize;
      klonX = Math.floor((mouse[0] / screenx) * columns);
      klonY = Math.floor((mouse[1] / screeny) * nbPixely);
    }

    function pen(color) {
      mousePosOnGrid();
      if (klonX < rows && klonY >= 0) {
        draw_pixel(klonX, klonY, color, 1);
      }
    }

    function eraser() {
      mousePosOnGrid();
      if (klonX < rows && klonY >= 0) {
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

    function saveCarre() 
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
    }

    saveCarre()

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

    function loadImage(imgURL, offsetx, offsety) {
      //ajouter nbPixel en entrée

      fetch(imgURL)
        .then((res) => res.blob())
        .then((blob) => {
          blob.arrayBuffer().then((buffer) => {
            var buff = UPNG.decode(buffer);
            var array = buff.data;

            for (let y = 0; y < buff.width; y++) {
              for (let x = 0; x < buff.height; x++) {
                let idx = (buff.width * y + x) * 4;
                if (array[idx + 3] != 0)
                  draw_pixel(x + offsetx, y + offsety, {rgba: {r: array[idx],g: array[idx + 1],b: array[idx + 2]}}, 2);
              }
            }
          });
        });
    }

    loadImage("https://i.imgur.com/qAhwWr9.png", 20, 15);

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