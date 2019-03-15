var redisHelper = require('../lib/redis_helper');
var mongoHelper = require('../lib/mongo_helper');
var utils = require('../lib/utils');
var redisCon = require('../lib/redis').Connection;

module.exports = async function(req, res){
    var query = utils.mergeTenantQuery(req.tenant.tenant_id, req.params.query);

    var suggestions = await redisHelper.fetchSuggestions(query);
    if(suggestions.length === 0){
        await mongoHelper.updateRedis(req.tenant, req.params.query);
        suggestions = await redisHelper.fetchSuggestions(query);
    }
    suggestions = utils.formatSuggestions(suggestions);
    res.json(suggestions);
};
