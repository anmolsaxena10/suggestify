var express = require('express');
var sugDelete = require('./suggest.delete');
var sugPost = require('./suggest.post');
var sugGet = require('./suggest.get');
var sugPut = require('./suggest.put');

var middleware = require('../lib/middleware');

var router = express.Router();

router.get('/suggest/:query', middleware.authenticate, sugGet);
router.post('/suggest/', sugPost);
router.delete('/suggest/', sugDelete);
router.put('/suggest/', sugPut);

module.exports = router;
