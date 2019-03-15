var redisHelper = require('../lib/redis_helper');
var mongoHelper = require('../lib/mongo_helper');
var utils = require('../lib/utils');
var redisCon = require('../lib/redis').Connection;

module.exports = async function(req, res){
    var query = utils.mergeTenantQuery(req.tenant.tenant_id, req.params.query);
    console.log(query);
    var suggestions = await redisHelper.fetchSuggestions(query);
    if(suggestions.length != 0) res.json(suggestions);
    else{
        console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");
        await mongoHelper.updateRedis(req.tenant, req.params.query);
        res.json(await redisHelper.fetchSuggestions(query));
    }
};
