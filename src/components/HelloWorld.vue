<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
var util = require('util')
var css = require('dom-css')
var grid = require('pixel-grid')
var parse = require('parse-color')
var position = require('mouse-position')

document.body.style.transition = '0.3s all'

var rows = 65
var columns = 120

var data = []

for (var i = 0; i < rows; i++) {
  for (var j = 0; j < columns; j++) {
    data.push([0, 0, 0])
  }
}


function drawOverlay (array) {
  array.forEach(function (el) {
    data[(el[0]) * columns + el[1]] = [1, 1, 1]
  })
}

var arrow = []

arrow = arrow.map(function (el) {
  return [el[0] + Math.floor(rows - 10), el[1] + Math.floor(columns - 8)]
})

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

var row, column, rand, color
var hue = 0

var started = false

mouse.on('move', function () {
  if (!started) started = true
  row = Math.floor(mouse[1] / 16)
  column = Math.floor(mouse[0] / 16)
  if (row < rows && column < columns) {
    hue = (hue + 1) % 360
    color = parse('hsl(' + hue + ',50, 50)').rgb
    // document.body.style.background = util.format('rgb(%s,%s,%s)', color[0], color[1], color[2])
    color = color.map(function (d) { return d / 50 })

    for (var i = -1; i < 2; i++) {
      for (var j = -1; j < 2; j++) {
        data[Math.min((row + i) * columns + (column + j), data.length)] = color
        data[Math.min((row + i + 1) * columns - (column + j), data.length)] = color
      }
    }
  }
})

pixels.frame(function () {
  drawOverlay(arrow)
  for (var i = 0; i < data.length; i++) {
    rand = Math.random() * 0.02
    data[i] = [
      data[i][0] * 0.95 + rand,
      data[i][1] * 0.95 + rand,
      data[i][2] * 0.95 + rand
    ]
  }
  pixels.update(data)
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #bb0d0d;
}
</style>
