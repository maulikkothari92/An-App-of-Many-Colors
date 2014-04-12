
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req,res){
    res.sendfile(__dirname + '/startup.html');''
});
app.get('/users', user.list);

var server = http.createServer(app).listen( app.get('port') );
var io = require('socket.io').listen(server, function() {
        console.log("Express server listening on port " + app.get('port'));
});

// A user connects to the server (opens a socket)
io.sockets.on('connection', function (socket) {

    socket.on('heartbeat', function () {
    // You can listen on this event to make sure your connection is receiving events correctly
    // The server will emit a heartbeat every 30 seconds to all connected clients
        setInterval(function() {
        socket.emit('heartbeat', someData);
        }, 30000);
    });
    socket.on('error', function (err) {
    // Sometimes things go wrong!
    
    console.log('Connection Error\n', err.toString());   // This is a message that should describe the error
    });
    // (2): The server recieves a ping event
    // from the browser on this socket
    socket.on('ping', function ( data ) {
        console.log('socket: server recieves ping (2)');

    // (3): Emit a pong event all listening browsers
        // with the data from the ping event
    io.sockets.emit( 'pong', data );   

    console.log('socket: server sends pong to all (3)');
    });

    socket.on( 'addClick', function( data, session ) {

    console.log( "session " + session + " drew:");
    console.log( data );


    socket.broadcast.emit( 'addClick', data );

  });
});