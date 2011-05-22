var http = require('http'),
    util = require('util'),
    zeromq  = require('zeromq');

var auth = 'Basic ' + new Buffer(process.argv[2] + ':' + process.argv[3]).toString('base64');
var options = {
    host: 'stream.twitter.com',
    port: 80,
    path: '/1/statuses/sample.json',
    headers: {
        authorization: auth
    }
};

var s = zeromq.createSocket('push');
s.bind('tcp://127.0.0.1:5554', function(err) {
    if (err) throw err;
    util.debug('bound ZMQ push server');
});
    
var tweet = '';
var strpos = -1;

http.get(options, function(res) {
    res.on('data', function(chunk) {
        chunk = chunk.toString();
        strpos = chunk.indexOf('\r');

        if (strpos !== -1) {
            tweet += chunk.substr(0, strpos);
            s.send(tweet);
            tweet = '';
        } else {
            tweet += chunk;
        }
    });
    res.on('end', function() {
        util.debug('end of response');
        res.end();
    });
});
