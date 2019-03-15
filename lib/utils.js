var jwt = require('jsonwebtoken');
var secret = require('../_config/keys').jwt_secret;

exports.verifyIdToken = function(authToken){
    try{
        var decoded = jwt.verify(authToken, secret);
        console.log(decoded);
        return decoded;
    }
    catch(e){
        return false;
    }
}

exports.mergeTenantQuery = function(tenant_id, prefix){
    return tenant_id + ':' + prefix;
}

exports.normalizeSuggestion = function(suggestion){
    suggestion = suggestion.toLowerCase();
    suggesiton = suggestion.trim();
    suggestion = suggestion.replace(/\s\s+/g, ' ');
    return suggestion;
}

exports.normalizePrefix = function(suggestion){
    suggestion = suggestion.toLowerCase();
    suggesiton = suggestion.trim();
    suggestion = suggestion.replace(/\s\s+/g, ' ');
    return suggestion;
}

exports.getPrefixes = function(suggestion){
    suggestion = exports.normalizePrefix(suggestion);

    var prefixes = [];
    for(var i=1 ; i <= suggestion.length ; i++){
        prefixes.push(suggestion.slice(0, i));
    }
    return prefixes;
}

exports.formatSuggestions = function(suggestions){
    var result = [];
    for(var i=0 ; i<suggestions.length ; i+=2){
        result.push({
            suggestion: suggestions[i],
            score: suggestions[i+1]
        });
    }
    return result;
}