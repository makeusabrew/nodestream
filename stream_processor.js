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
        // rebuild the tweet
        data = JSON.parse(data);
        // @todo more processing here...

        // stick the processed tweet on another queue
        repData = {
            text: data.text,
            user: data.user.screen_name
        };
        push.send(JSON.stringify(repData));
        util.debug("OK");
    } catch (e) {
        util.debug("parse failed");
    }
});

