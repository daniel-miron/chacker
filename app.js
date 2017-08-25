'use strict'
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(`${__dirname}/public`));

const port = process.env.PORT || 8080;

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.broadcast.emit('hi', "hi")
    socket.on('newUser', function (data) {
        console.log('newUser: ' + data.name + ' on team ' + data.team);
    });
    socket.on('gameData', function (data) {
        console.log('got data ' + data)
        socket.broadcast.emit('gameData', data);
        socket.emit('gameData', data);
    });
});

http.listen(port, function () {
    console.log('listening on *:', port);
});