module.exports = {

	'mongodb': process.env.MONGODB_CONNECTION_STRING,
	'redis': process.env.REDIS_CONNECTION_STRING || 'redis://127.0.0.1:6379'

};