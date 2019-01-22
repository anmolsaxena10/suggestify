var app = require('express')();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cassandra = require('cassandra-driver');
var redisClient = require('./lib/redis');
var helper = require('./lib/helper');

var db_config = require('./_config/database');

var port = process.env.PORT || 8080;

const cassandraClient = new cassandra.Client({contactPoints:['127.0.0.1'], keyspace: 'suggestify'});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use(morgan('dev'));

redisClient().then(function(redis){
	app.get('/', function(req, res){
		res.send('Hello! The API is at http://localhost:'+port+'/api');
	});

	app.get('/suggest/:query', function(req, res){
		helper.fetchSuggestions(req.params.query).then(
			suggestions => {
				if(suggestions != undefined){
					res.json(suggestions);
				}
			},
			err => {
				console.log(err);
			}
		);
	});

	var server = app.listen(port);
	console.log('Magic happens at http://localhost:' + port);
});