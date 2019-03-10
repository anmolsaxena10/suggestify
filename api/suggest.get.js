var redisHelper = require('../lib/redis_helper');
var mongoHelper = require('../lib/mongo_helper');

var redisCon = require('../lib/redis').Connection;

module.exports = async function(req, res){
    var suggestions = await redisHelper.fetchSuggestions(req.params.query);
    if(suggestions.length != 0) res.json(suggestions);
    else{
        await mongoHelper.updateRedis(req.params.query);
        res.json(await redisHelper.fetchSuggestions(req.params.query));
    }
};
