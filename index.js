var app = require('express')();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var port = process.env.PORT || 8080;
var apiRouter = require('./api/index');
var mongoCon = require('./lib/mongo').Connection;
mongoCon.connectToMongo();

var redisCon = require('./lib/redis').Connection;
(async () => {
	await redisCon.connectToRedis();
})();
// redisCon.client.zrange(['h', 0, -1], (err, ans) => {console.log(ans)});
// var db_config = require('./_config/database');

app.get('/', function (req, res) {
	res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use(morgan('dev'));

app.use('/api', apiRouter);

var server = app.listen(port);
console.log('Magic happens at http://localhost:' + port);
