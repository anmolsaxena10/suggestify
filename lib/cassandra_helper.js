var csv = require('csv-parser');
var fs = require('fs');

const cassandra = require('cassandra-driver');
const cassandraClient = new cassandra.Client({ contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1', keyspace: 'suggestify' });

var redisHelper = require('./redis_helper');

exports.updateRedis = function(query){
    cql = "SELECT * FROM general WHERE query > ? and query < ? ALLOW FILTERING;";
    cassandraClient.execute(cql, [query, query.slice(0, -2)+String.fromCharCode(query.slice(-1).charCodeAt() + 1)])
    .then(result => {
        var rowLength = result['rowLength'];
        for(i=0 ; i<rowLength ; i++){
            var j=0;
            while(j<10 && j<result['rows'][i]['query'].length){
                
            }
        }
        console.log(result['rows'][0]['query'][0]);
    });

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
