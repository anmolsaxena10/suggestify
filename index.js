var app = require('express')();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var port = process.env.PORT || 8080;
var apiRouter = require('./api/index');

// var db_config = require('./_config/database');
//const cassandraClient = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'suggestify' });

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
