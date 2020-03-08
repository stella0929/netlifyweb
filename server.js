
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

router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  fs.readFile(__dirname+ '/public/main.html', function(err, data){ // 파일 읽는 메소드
        if (err) {
          return console.error(err); // 에러 발생시 에러 기록하고 종료
        }
        res.end(data, 'utf-8'); // 브라우저로 전송
      });
});


route_loader.init(app,express.Router());


var errorHandler = expressErrorHandler({
	static: {
		'404': './public/404.html'
	}
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

app.use('/.netlify/functions/server', router);  // path must route to lambda


module.exports = app;
module.exports.handler = serverless(app);