var client = require("./redis");

exports.fetchSuggestions = (query) => {
    return new Promise((resolve, reject) => {
        client().then(
            res => {
                res.zrangeAsync(query, 0, -1).then(
                    suggestions => {
                        resolve(suggestions);
                    },
                    err => {
                        reject();
                    }
                );
            }
        );
    });
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