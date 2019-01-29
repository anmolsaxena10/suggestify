var csv = require('csv-parser');
var fs = require('fs');

const cassandra = require('cassandra-driver');
const cassandraClient = new cassandra.Client({ contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1', keyspace: 'suggestify' });

var redisHelper = require('./redis_helper');

exports.updateRedis = function(query){
    
};

exports.loadGeneralData = function (path) {
    // var csql = 'CREATE TABLE general (query text PRIMARY KEY, freq set<varint>);';
    // cassandraClient.execute(csql)
    // .then(() => console.log('yay'));

    var result = [];
    var cql = 'UPDATE suggestify.general SET frequency = frequency + 1 WHERE query = ?';

    fs.createReadStream(path)
    .pipe(csv({separator: '\t'}))
    .on('data', (data) => {
        // result.push({
        //     query: cql,
        //     params: [data['Query']]
        // });
        cassandraClient.execute(cql, [data['Query']], {prepare: true})
        .then(result => console.log('Data uploaded'));
    })
    .on('end', () => {
        
        // console.log(result);
    });
};
