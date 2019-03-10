var redis = require('redis');
var promise = require('bluebird');
var redisUrl = require('../_config/database').redis;

promise.promisifyAll(redis.RedisClient.prototype);
promise.promisifyAll(redis.Multi.prototype);

class Connection {
    static connectToRedis() {
		const that = this;
        if ( this.client ) return Promise.resolve(this.client);
		return new Promise((resolve, reject) => {
			that.client = redis.createClient(that.url);
	
			that.client.on("error", () => {
				console.log('Redis error');
				reject("Redis Connection failed");
			});
	
			that.client.on("connect", () => {
				console.log('Redis connected');
				resolve(that.client);
			});
		});
	}
}

Connection.client = null;
Connection.url = redisUrl;

module.exports = { Connection }