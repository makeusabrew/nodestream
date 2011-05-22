var util = require('util'),
    zeromq  = require('zeromq');

var queue = zeromq.createSocket('pull');

queue.on('message', function(data) {
    util.debug("got data");
});

queue.connect('tcp://127.0.0.1:5554');
