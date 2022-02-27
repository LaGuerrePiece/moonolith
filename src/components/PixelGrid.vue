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

for (var i = 0; i < rows; i++) {
  for (var j = 0; j < columns; j++) {
    data.push([0, 0, 0])
  }
}
console.log(data)
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


mouse.on('move', function () {
  var screenx = document.documentElement.clientWidth
  var screeny = document.documentElement.clientHeight
  var pixelSize = screenx / columns
  var nbPixely = screeny / pixelSize
  mousex = Math.floor((mouse[0] / screenx) * columns )
  mousey = Math.floor((mouse[1] / screeny) * nbPixely)

  console.log("mousepos: x:" + mouse[0] + "y:"+ mouse[1] + " screen size " +  screeny)
  console.log("mouseposongrid: x:" + mousex + "y:"+mousey)
  if (mousex < rows && mousey < columns) {
    hue = (hue + 1) % 360
    color = parse('hsl(' + hue + ',50, 50)').rgb
    // document.body.style.background = util.format('rgb(%s,%s,%s)', color[0], color[1], color[2])
    color = color.map(function (d) { return d / 50 })

    draw_pixel(mousex, mousey, color)
    // EL CQRRE
    // for (var i = -1; i < 0; i++) {
    //   for (var j = -1; j < 0; j++) {
    //     data[Math.min((row + i) * columns + (column + j), data.length)] = color
    //     data[Math.min((row + i + 1) * columns - (column + j), data.length)] = color
    //   }
    // }
  }
})


// fonction noise
pixels.frame(function () {
  for (var i = 0; i < data.length; i++) {
    rand = Math.random() * 0.02
    data[i] = [
      data[i][0] * 0.95 + rand,
      data[i][1] * 0.95 + rand,
      data[i][2] * 0.95 + rand
    ]
  }
  pixels.update(data)
  draw_pixel(2,2, [0.3,0.8,0.7])
})
pixels.canvas.style.width = "100%"

function draw_pixel(x, y, color){
  data[y * columns + x] = color
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
