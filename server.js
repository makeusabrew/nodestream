var http    = require('http'),
    util    = require('util'),
    zeromq  = require('zeromq'),
    express = require('express'),
    io      = require('socket.io'),
    mongo   = require('mongodb'),
    redis   = require('redis');

/**
 * DB init
 */
db = new mongo.Db('nodestream', new mongo.Server('localhost', mongo.Connection.DEFAULT_PORT, {}), {});
db.open(function(err, client) {
    if (err) throw err;
    // all good
});

redis = redis.createClient();

/**
 * Queue goodies
 */
var queue = zeromq.createSocket('pull');

queue.bind('tcp://127.0.0.1:5556', function(err) {
    if (err) throw err;
    util.debug('bound ZMQ pull server');

    queue.on('message', function(data) {
        var details = JSON.parse(data);
        if (details.urls) {
            // got urls? great!
            db.collection('urls', function(err, collection) {
                if (err) throw err;
                // loop over them one by one
                details.urls.forEach(function(url) {
                    // set a redis key to quickly count the occurences
                    redis.incr(url, function(err, val) {
                        var data = {
                            "url": url,
                            "count": val
                        };
                        // slap the record in our DB or update it if it exists
                        collection.update({url: url}, {$set: data}, {upsert:true});
                    });
                });
            });
        }
    });
});

/**
 * Server setup
 */
var app = express.createServer();

app.configure(function() {
    //app.use(express.logger());
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.static(__dirname + '/../public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.set('view engine', 'jade');
});

app.get('/', function(req, res) {
    db.collection('urls', function(err, collection) {
        if (err) throw err;
        collection.find({}, {limit: 1, sort:[['count','desc']]}).nextObject(function(err, docs) {
            res.send(docs);
        });
    });
});


app.listen(8124);

/**
 * Socket stuff
 */
var socket = io.listen(app);
