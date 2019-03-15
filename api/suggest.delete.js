var utils = require('../lib/utils');
var redisHelper = require('../lib/redis_helper');
var mongoHelper = require('../lib/mongo_helper');

module.exports = async function(req, res){
    var suggestions = req.body.suggestions;
    if (suggestions != undefined) {
        if(!Array.isArray(suggestions)) suggestions = [suggestions];
        var allPrefixes = [];
        var commands = [];
        for (var i = 0; i < suggestions.length; i++) {
            var suggestion = utils.normalizeSuggestion(suggestions[i]);
            var prefixes = utils.getPrefixes(suggestion);
            allPrefixes = [...allPrefixes, ...prefixes];

            for(var j=0 ; j<prefixes.length ; j++){
                var query = utils.mergeTenantQuery(req.tenant.tenant_id, prefixes[j]);
                console.log('query: '+query+' suggestion: '+suggestion);
                commands.push(['zrem', query, suggestion]);
            }
        }

        await redisHelper.batchExecute(commands);
        mongoHelper.persistPrefixes(allPrefixes, req.tenant);

        return res.sendStatus(202);
    }
    return res.sendStatus(400);
};