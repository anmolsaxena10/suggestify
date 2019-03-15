var client = require("./redis");
var redisCon = require('../lib/redis').Connection;
var utils = require('../lib/utils');
var mongoHelper = require('../lib/mongo_helper');

exports.fetchSuggestions = async function(query){
    return await redisCon.client.zrangeAsync(query, 0, -1, 'WITHSCORES');
};

exports.insertPrefix = async function(tenant, prefixes, suggestion){
    for(var i=0 ; i<15 && i<prefixes.length ; i++){
        var query = utils.mergeTenantQuery(tenant.tenant_id, prefixes[i]);
        var count = await exports.getSuggestionCount(tenant, prefixes[i], query);

        if(count<5){
            await redisCon.client.zaddAsync(query, 'NX', 0, suggestion);
        }
    }
}

exports.getSuggestionCount = async function(tenant, prefix, query){
    var count = await redisCon.client.zcountAsync(query, '-inf', '+inf');

    if(count == 0){
        await mongoHelper.updateRedis(tenant, prefix);
        count = await redisCon.client.zcountAsync(query, '-inf', '+inf');
    }
    return count;
}

exports.batchExecute = async function(commands){
    return await redisCon.client.batch(commands).execAsync();
}

exports.includesSuggestion = async function(query, suggestion){
    var score = await redisCon.client.zscoreAsync(query, suggestion);
    if(score<0) return false;
    else return true;
}

exports.fetchSuggestion = async function(query, position){
    return await redisCon.client.zrangeAsync(query, position, position, 'WITHSCORES');
}