var cluster = require('cluster');
var http = require('http');
var path = require('path');
var ejs = require('ejs');
var routes = require('./routes');
var express = require('express');
var app = express();   
const getToken = require('common');
getToken();

var numCPUs = require('os').cpus().length;
console.log(numCPUs);
// all environments
app.set('port', process.env.PORT || 9001);
app.set('views', path.join(__dirname, 'views'));//__dirname
app.engine('html',ejs.__express);
app.set('view engine', 'html');

// app.use(express.basicAuth("gys","123"));
app.use(express.cookieParser());
app.use(express.session({secret:"test"}));
app.use(express.favicon(path.join(__dirname, 'public/favicon.ico'))) 
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.query());
app.use(express.bodyParser());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
//微信入口
app.get('/wechat', routes.wechat);
app.post('/wechat', routes.wechat);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port' + app.get('port'));
});
