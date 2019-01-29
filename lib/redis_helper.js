var client = require("./redis");

exports.fetchSuggestions = (query) => {
    return new Promise((resolve, reject) => {
        client().then(
            res => {
                res.lrangeAsync(query, 0, -1).then(
                    suggestions => {
                        resolve(suggestions);
                    },
                    err => {
                        reject("Redis connection failed: " + err);
                    }
                );
            }
        );
    });
};