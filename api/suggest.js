var helper = require('../lib/redis_helper');

module.exports = function(req, res){
    helper.fetchSuggestions(req.params.query).then(
		suggestions => {
			if (suggestions != undefined) {
				res.json(suggestions);
			}
		},
		err => {
			console.log(err);
		}
	);
};
