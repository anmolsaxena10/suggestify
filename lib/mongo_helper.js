var mongoCon = require('./mongo').Connection;
var redisHelper = require('./redis_helper');
var utils = require('../lib/utils');

exports.updateRedis = async function(tenant, prefix){
    var commands = [];
    var suggestions = await exports.find(tenant, prefix);
    var query = utils.mergeTenantQuery(tenant.tenant_id, prefix);

    for(var i=0 ; i<(suggestions.length-1) ; i+=2){
        commands.push(['zadd', query, suggestions[i+1], suggestions[i]]);
    }

    return await redisHelper.batchExecute(commands);
}

exports.find = async function(tenant, prefix){
    var suggestions = await mongoCon.db.collection(tenant.tenant_id).find({prefix}).limit(1).toArray();
    // console.log(suggestions);
    if(suggestions[0]) return suggestions[0].suggestions;
    return [];
}

exports.insertPrefix = function(prefix, tenant, suggestions){
    var args = [{prefix}, {$set: {suggestions}}, {upsert: true}];
    var col = mongoCon.db.collection(tenant.tenant_id);
    col.createIndex({prefix: "text"}, {background: true});
    col.findOneAndUpdate(...args, (err, result) => {});
}

exports.deletePrefix = function(prefix, tenant){
    mongoCon.db.collection(tenant.tenant_id).findOneAndDelete({prefix}, (err, result) => {});
}

exports.persistPrefixes = async function(prefixes, tenant){
    for(var i=0 ; i<prefixes.length ; i++){
        var query = utils.mergeTenantQuery(tenant.tenant_id, prefixes[i]);
        var suggestions = await redisHelper.fetchSuggestions(query);

        if(suggestions.length === 0){
            exports.deletePrefix(prefixes[i], tenant);
        }
        else{
            exports.insertPrefix(prefixes[i], tenant, suggestions);
        }
    }
}