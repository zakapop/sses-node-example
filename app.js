
/**
 * Module dependencies.
 */

var express = require('express'),
    routes  = require('./routes/index'),
    redis   = require('redis'),
    publisherClient = redis.createClient();
var app = module.exports = express.createServer();
var kiosk = require('./routes/kiosk');
var port = process.env.PORT || 1337;
// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.use('/', routes);
app.use('/kiosk', kiosk);


app.get('/', function(req, res){
  res.render('index');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var server = app.listen(port, function(){
  console.log('listening on port %d', server.address().port);
});

module.exports = app;
// app.get('/kiosk', function(req, res){
//     // let request last as long as possible
//     req.socket.setTimeout(Infinity);
//     var messageCount = 0;
//     var subscriber = redis.createClient();
//     subscriber.subscribe("updates");
//     console.log("starting.....")
//    // In case we encounter an error...print it out to the console
//     subscriber.on("error", function(err) {
//        console.log("Redis Error: " + err);
//     });
 
//     // When we receive a message from the redis connection
//     subscriber.on("message", function(channel, message) {
//        res.write(message + '\n\n'); // Note the extra newline
//     });
 
//     //send headers for event-stream connection
//     res.writeHead(200, {
//      'Content-Type': 'text/event-stream',
//      'Cache-Control': 'no-cache',
//      'Connection': 'keep-alive'
//     });
//     res.write('\n');
 
//   // The 'close' event is fired when a user closes their browser window.
//   // In that situation we want to make sure our redis channel subscription
//   // is properly shut down to prevent memory leaks...and incorrect subscriber
//   // counts to the channel.
//   req.on("close", function() {
//     subscriber.unsubscribe();
//     subscriber.quit();
//   });
     
// });

// app.get('/kiosk/:user_name', function(req, res){
//   var name = req.params.user_name;
//   console.log('sending ' + name);
//   publisherClient.publish('updates', ("Hello, " + name));
//   res.writeHead(200, {'Content-Type': 'text/html'});
//   res.end();
// });

