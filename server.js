var http = require('http'),
    util = require('util'),
    zeromq  = require('zeromq');

var queue = zeromq.createSocket('pull');

queue.bind('tcp://127.0.0.1:5556', function(err) {
    if (err) throw err;
    util.debug('bound ZMQ pull server');

    queue.on('message', function(data) {
        util.debug(data);
    });
});
