var utils = require('../lib/utils');
var redisHelper = require('../lib/redis_helper');
var mongoHelper = require('../lib/mongo_helper');

module.exports = async function(req, res){
    var suggestion = req.body.suggestion;
    var suggestion = utils.normalizeSuggestion(suggestion);
    var prefixes = utils.getPrefixes(suggestion);
    var commands = [];

    for(var i=0 ; i<prefixes.length ; i++){
        var query = utils.mergeTenantQuery(req.tenant.tenant_id, prefixes[i]);
        var count = redisHelper.getSuggestionCount(req.tenant, prefixes[i], query);
        var includesSuggestion = await redisHelper.includesSuggestion(query, suggestion);
        if(count>=5 && !includesSuggestion){
            var lastElement = await redisHelper.fetchSuggestion(query, 4);
            var newScore = lastElement[1] - 1;
            commands.push(['zremrangebyrank', query, 4, -1]);
            commands.push(['zadd', query, newScore, suggestion]);
        }
        else{
            commands.push(['zincrby', query, -1, suggestion]);
        }
    }

    await redisHelper.batchExecute(commands);
    mongoHelper.persistPrefixes(prefixes, req.tenant);

    return res.sendStatus(202);
};