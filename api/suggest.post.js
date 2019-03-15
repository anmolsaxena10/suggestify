var utils = require('../lib/utils');
var redisHelper = require('../lib/redis_helper');
var mongoHelper = require('../lib/mongo_helper');

module.exports = async function(req, res){
    var suggestions = req.body.suggestions;
    var allPrefixes = [];
    for(var i=0 ; i<suggestions.length ; i++){
        var suggestion = utils.normalizeSuggestion(suggestions[i]);
        var prefixes =  utils.getPrefixes(suggestion);
        await redisHelper.insertPrefix(req.tenant, prefixes, suggestion);
        allPrefixes = [...allPrefixes, ...prefixes];
        console.log(prefixes);
    }

    await mongoHelper.persistPrefixes(allPrefixes, req.tenant);

    return res.status(200);
};