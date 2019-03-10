const MongoClient = require('mongodb').MongoClient
var connString = require('../_config/database').mongodb;

class Connection {
    static connectToMongo() {
        if ( this.db ) return Promise.resolve(this.db)
        return MongoClient.connect(this.url, this.options)
            .then(client => {
                this.db = client.db('suggestify');
                this.client = client;
            })
    }
}

Connection.client = null;
Connection.db = null
Connection.url = connString;
Connection.options = {
    bufferMaxEntries:   0,
    reconnectTries:     5000,
    useNewUrlParser: true
}

module.exports = { Connection }