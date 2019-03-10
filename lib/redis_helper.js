var client = require("./redis");
var redisCon = require('../lib/redis').Connection;

exports.fetchSuggestions = async (query) => {
    return await redisCon.client.zrangeAsync(query, 0, -1, 'WITHSCORES');
};

exports.insertPrefix = (query) => {
    return new Promise((resolve, reject) => {
        client().then(
            res => {
                var i=1;
                while(i<=10 && i<query.length){
                    // console.log([query.substring(0, i), 1, query]);
                    res.zaddAsync([query.substring(0, i), 1, query])
                    .then(()=>console.log('updated'));
                    i++;
                }
                resolve();
            }
        );
    });
}