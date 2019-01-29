var express = require('express');
var suggest = require('./suggest');
var remember = require('./remember');

var router = express.Router();

router.get('/suggest/:query', suggest);
router.post('/remember', remember);

module.exports = router;
