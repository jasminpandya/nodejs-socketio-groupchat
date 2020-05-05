const express= require('express');
const app = express();
const http=require('http').Server(app);
const io = require('socket.io')(http);

const port=8080;
const hostlist=process.argv.splice(2);

const ioc = require('socket.io-client');
let sockets = [];
for(index in hostlist){
    console.log(hostlist[index]);
    sockets.push(ioc.connect(hostlist[index]));
}

//connect to all nodes


io.sockets.on('connection', function(socket) {
    // console.log(socket);
    socket.on('moderate', function(message) {
        console.log('request on ' + process.pid);        
        console.log(message);
        for(index in sockets){
            sockets[index].emit(message.event, message);
        }        
        // io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

});

function startServer(port) {
    const server = http.listen(port,function(){
        console.log('listening on ' + port + "PID " + process.pid);
    })
}

startServer(port);