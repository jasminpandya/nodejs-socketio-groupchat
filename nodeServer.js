const express= require('express');
const app = express();
const http=require('http').Server(app);
const io = require('socket.io')(http);

const port = process.argv[2]

const ioc = require('socket.io-client');
const moderator=ioc.connect('http://localhost:8080');
const pid = process.pid;
io.sockets.on('connection', function(socket) {
    socket.on('username', function(msg) {        
        console.log(msg)        
        if( !msg.pid || (msg.pid && msg.pid !== pid)){
            socket.username = msg.data;
            io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
        }
        if(!msg.pid){
            moderator.emit("moderate",{...msg, pid:pid, event:'username'});
        }        
    });

    socket.on('disconnect', function(username) {
        console.log(username);
        console.log(username + 'disconnected');
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
        // moderator.emit("moderate",{"disconnect":socket.username});
    })

    socket.on('chat_message', function(msg) {
        console.log(msg)
        if( !msg.pid || (msg.pid && msg.pid !== pid)){
            io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + msg.data);
        }
        if(!msg.pid){
            moderator.emit("moderate",{...msg, pid:pid, event:'chat_message'});
        }        
    });

});

function startServer(port) {
    const server = http.listen(port,function(){
        console.log('listening on ' + port + "PID " + pid);
    })
}

startServer(port);