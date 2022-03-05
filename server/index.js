var express = require('express');
var app = express();
const fs = require('fs');
// app.use(express.static('./public'));

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
    res.send('hello world');
});

app.get('/liste', function(req, res) {
    // res.send('kikoue')
    // fs.readFile('liste.txt', text => { console.log(text) })
    fs.readFile('liste.txt', { encoding: "utf8" }, function(err, data) {
        if (err) {
            console.log(err)
        }
        console.log(data);
        res.send(data);
    })
})

app.listen(3001);