<template>
  <div>
  </div>
</template>

<script>
var util = require('util')
var css = require('dom-css')
var grid = require('pixel-grid')
var parse = require('parse-color')
var position = require('mouse-position')

document.body.style.transition = '0.3s all'

var rows = 90
var columns = 60

var data = []
var persistentData = []

for (var i = 0; i < rows; i++) {
  for (var j = 0; j < columns; j++) {
    data.push([0, 0, 0])
    persistentData.push([[0, 0, 0], 0])
  }
}

var pixels = grid(data, {
  root: document.body,
  rows: rows,
  columns: columns,
  size: 15,
  padding: 1,
  background: [0, 0, 0],
  formatted: true
})

// pixels.canvas.style.marginLeft = (window.innerWidth * 0.03) / 2 + 'px'
// pixels.canvas.style.marginTop = (window.innerHeight * 0.04) / 2 + 'px'

var mouse = position(pixels.canvas)

var mousex, mousey, rand, color
var hue = 0
var toggleDraw = false

document.body.addEventListener("mousedown", () => {
  toggleDraw = true
})

document.body.addEventListener("mouseup", () => {
  toggleDraw = false
})

function pen(color)
{
  var screenx = document.documentElement.clientWidth
  var screeny = document.documentElement.clientHeight
  var pixelSize = screenx / columns
  var nbPixely = screeny / pixelSize
  mousex = Math.floor((mouse[0] / screenx) * columns )
  mousey = Math.floor((mouse[1] / screeny) * nbPixely)

  if (mousex < rows && mousey < columns) {
    draw_pixel(mousex, mousey, color)
  }
}

function draw_persistent_data()
{
    for (var i = 0; i < data.length; i++) {
      if (persistentData[i][1] != 0)
        data[i] = persistentData[i][0]
    }
}


pixels.frame(function () {
  // fonction noise
  for (var i = 0; i < data.length; i++) {
    rand = Math.random() * 0.02
    data[i] = [
      data[i][0] * 0.95 + rand,
      data[i][1] * 0.95 + rand,
      data[i][2] * 0.95 + rand
    ]
  }
  
  draw_persistent_data()
  pixels.update(data)
})
pixels.canvas.style.width = "100%"

function draw_pixel(x, y, color){
  pos = y * columns + x
  persistentData[pos][0] = color
  persistentData[pos][1] = 1 //marqueur "dessiné"
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
