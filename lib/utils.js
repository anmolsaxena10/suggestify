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