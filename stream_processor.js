var util = require('util'),
    zeromq  = require('zeromq');

// the queue we'll get raw tweet data off
var queue = zeromq.createSocket('pull');
queue.connect('tcp://127.0.0.1:5554');

// the queue we'll push processed data onto
var push = zeromq.createSocket('push');
push.connect('tcp://127.0.0.1:5556');

util.debug("connected to pull & push servers");

var repData = {};
queue.on('message', function(data) {
    try {
        // rebuild the tweet
        data = JSON.parse(data);

        // @todo more processing here...
        var urls = data.text.match(/(https?:\/\/[^\s]+)/g);

        // stick the processed tweet on another queue
        repData = {
            text: data.text,
            user: data.user.screen_name
        };
        if (urls) {
            repData.urls = urls;
            util.debug(urls);
        }
        push.send(JSON.stringify(repData));
        //util.debug("OK");
    } catch (e) {
        util.debug("parse failed");
    }
});

