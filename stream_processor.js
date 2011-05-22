var util = require('util'),
    zeromq  = require('zeromq');

var queue = zeromq.createSocket('pull');
queue.connect('tcp://127.0.0.1:5554');

var push = zeromq.createSocket('push');
push.connect('tcp://127.0.0.1:5556');

util.debug("connected to pull & push servers");

var repData = {};
queue.on('message', function(data) {
    try {
        data = JSON.parse(data);
        repData.text = data.text;
        push.send(JSON.stringify(repData));
    } catch (e) {
        util.debug(data);
    }
});

