var redisHelper = require('../lib/redis_helper');
var cassandraHelper = require('../lib/cassandra_helper');

module.exports = async function(req, res){
    // redisHelper.fetchSuggestions(req.params.query).then(
	// 	suggestions => {
	// 		if (suggestions != undefined) {
	// 			res.json(suggestions);
	// 		}
	// 	},
	// 	err => {
    //         console.log(err);
    //         cassandraHelper.updateRedis(req.params.query);

    //         res.json([]);
	// 	}
    // );
    
    try{
        var suggestions = await redisHelper.fetchSuggestions(req.params.query);
        if(suggestions.length != 0) res.json(suggestions);
        else throw('not found');
    }
    catch(err){
        await cassandraHelper.updateRedis(req.params.query);
        res.json(await redisHelper.fetchSuggestions(req.params.query));
    }

    
};
