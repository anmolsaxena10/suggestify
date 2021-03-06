var utils = require('./utils');

exports.authenticate = function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', '*');
	res.header('Access-Control-Allow-Credentials', 'true');

    if ('OPTIONS' === req.method) {
		res.sendStatus(200);
	}
	else {
		var authToken = req.header('authorization');

		if(authToken){
            var decoded = utils.verifyIdToken(authToken);
			if(decoded != false){
				req.tenant = decoded;
				next();
            }
            else{
                return res.sendStatus(401);
            }
		}
		else{
			return res.sendStatus(401);
		}
	}
}