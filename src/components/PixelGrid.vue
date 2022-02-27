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
    var util = require("util");
    var css = require("dom-css");
    var grid = require("pixel-grid");
    var parse = require("parse-color");
    var position = require("mouse-position");
    var fs = require("fs");
    var PNG = require("pngjs").PNG;

    document.body.style.transition = "0.3s all";

    var rows = 90;
    var columns = 60;

    var data = [];
    var persistentData = this.load();
    var fillPersitent = false;

    if (persistentData.length == 0) fillPersitent = true;

    window.addEventListener("beforeunload", () => {
      this.save(persistentData);
    });

    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < columns; j++) {
        data.push([0, 0, 0]);
        if (fillPersitent) persistentData.push([[0, 0, 0], 0]); //[color, displayed]
      }
    }
    var pixels = grid(data, {
      root: document.body,
      rows: rows,
      columns: columns,
      size: 15,
      padding: 1,
      background: [0, 0, 0],
      formatted: true,
    });

    // pixels.canvas.style.marginLeft = (window.innerWidth * 0.03) / 2 + 'px'
    // pixels.canvas.style.marginTop = (window.innerHeight * 0.04) / 2 + 'px'

    var mouse = position(pixels.canvas);

    var mousex, mousey, rand, color;
    var hue = 0;
    var toggleDraw = false;

    document.body.addEventListener("mousedown", () => {
      toggleDraw = true;
    });

    document.body.addEventListener("mouseup", () => {
      toggleDraw = false;
    });

    function mousePosOnGrid() {
      var screenx = document.documentElement.clientWidth;
      var screeny = document.documentElement.clientHeight;
      var pixelSize = screenx / columns;
      var nbPixely = screeny / pixelSize;
      mousex = Math.floor((mouse[0] / screenx) * columns);
      mousey = Math.floor((mouse[1] / screeny) * nbPixely);
    }

    function pen(color) {
      mousePosOnGrid();
      if (mousex < rows && mousey < columns) {
        draw_pixel(mousex, mousey, color);
      }
    }

    function eraser() {
      mousePosOnGrid();
      if (mousex < rows && mousey < columns) {
        erase_pixel(mousex, mousey);
      }
    }

    function draw_persistent_data() {
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

    // function loadImage(imgURL) {
    //   //ajouter nbPixel en entrée

    //   fetch(imgURL)
    //     .then((res) => res.blob())
    //     .then((blob) => {
    //       // Here's where you get access to the blob
    //       // And you can use it for whatever you want
    //       // Like calling ref().put(blob)
    //       blob.arrayBuffer().then((buffer) => {
    //         const array = new Uint8Array(buffer);
    //         console.log(array[0]);
    //         console.log(blob);
    //       });
    //     });
    // }

    function getBase64FromImageUrl(url) {
      var img = new Image();

      img.setAttribute("crossOrigin", "anonymous");

      img.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        var array = (
          Buffer.from(
            dataURL.replace(/^data:image\/(png|jpg);base64,/, ""),
            "base64"
          )
        );

        for (let y = 0; y < 32; y++) {
          for (let x = 0; x < 32; x++) {
            let idx = 32 * y + x;
            console.log(
              "array [" +
                idx +
                "] = " +
                array[idx] +
                "," +
                array[idx + 1] +
                "," +
                array[idx + 2]
            );
            draw_pixel(x, y, {
              rgba: {
                r: array[idx],
                g: array[idx + 1],
                b: array[idx + 2],
              },
            });
          }
        }
      };

      img.src = url;
    }

    getBase64FromImageUrl("https://i.imgur.com/qAhwWr9.png");
    // loadImage("https://i.imgur.com/qAhwWr9.png");

    var component = this;

    pixels.frame(function () {
      draw_noise();
      if (toggleDraw) pen(component.currentColor);
      draw_persistent_data();
      pixels.update(data);
    });
    pixels.canvas.style.width = "100%";

    function draw_pixel(x, y, color) {
      var pos = y * columns + x;
      color = to_color_array(color);
      persistentData[pos][0] = color;
      persistentData[pos][1] = 1; //marqueur "dessiné"
    }

    function erase_pixel(x, y) {
      var pos = y * columns + x;
      persistentData[pos][0] = [0, 0, 0];
      persistentData[pos][1] = 0; //marqueur "dessiné"
    }

    function to_color_array(color) {
      color = color.rgba;
      color = [color.r / 255, color.g / 255, color.b / 255];
      return color;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>