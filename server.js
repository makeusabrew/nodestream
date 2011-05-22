var http = require('http'),
    util = require('util'),
    zeromq  = require('zeromq');

var queue = zeromq.createSocket('rep');

queue.bind('tcp://127.0.0.1:5554', function(err) {
    if (err) throw err;
    queue.on('message', function(data) {
        util.debug("got data "+data.toString("utf8"));
    });
});
