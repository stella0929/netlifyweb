const express = require('express');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
var static = require('serve-static');
var path = require('path');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

//에러 헨들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

var database_loader = require('./database/database_loader');
var config = require('./config');
var route_loader = require('./routes/route_loader');

console.log('config.server_port ->'+config.server_port);
app.set('port', config.server_port || 3000);
app.use('/public',static(path.join(__dirname,'/public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
	secret: 'my key',
	resave: true, 
	saveuninstalized: true
}));



router.get('/', function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});


app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', function(req, res){res.sendFile(path.join(__dirname, '/index.html'))});


module.exports = app;
module.exports.handler = serverless(app);