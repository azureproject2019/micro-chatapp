// in sublime
var express = require('express');
var port = process.env.PORT || 3000;
var app = express();
app.use(express.static(__dirname +'/dist'))

app.listen(port, function () {
 console.log('App listening on port !');
});
