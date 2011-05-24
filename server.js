var http = require('http'),
    util = require('util'),
    zeromq  = require('zeromq'),
    io = require('socket.io');

/**
 * Queue goodies
 */
var queue = zeromq.createSocket('pull');

queue.bind('tcp://127.0.0.1:5556', function(err) {
    if (err) throw err;
    util.debug('bound ZMQ pull server');

    queue.on('message', function(data) {
        util.debug(data);
        //socket.broadcast(data);
    });
});

/**
 * Server setup
 */
var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end('todo');
});

server.listen(8124);

var socket = io.listen(server);
