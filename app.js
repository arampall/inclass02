var express = require('express');
var bodyparser = require('body-parser');
var app = express();
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
var connection = require('./connection');
var routes = require('./routes');
connection.init();
routes.configure(app);
var server = app.listen(80, function() {
  console.log('Server listening on port ' + server.address().port);
});
