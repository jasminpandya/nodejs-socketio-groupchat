var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.get('/c1', function(req, res) {
    res.sendFile(__dirname + '/indexc1.html');
});

app.get('/c2', function(req, res) {
    res.sendFile(__dirname + '/indexc2.html');
});

server.listen(8081);