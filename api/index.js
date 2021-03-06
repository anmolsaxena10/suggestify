var express = require('express');
var sugDelete = require('./suggest.delete');
var sugPost = require('./suggest.post');
var sugGet = require('./suggest.get');
var sugPut = require('./suggest.put');

var middleware = require('../lib/middleware');

var router = express.Router();
router.use(middleware.authenticate);
router.get('/suggest/:query', sugGet);
router.post('/suggest/', middleware.authenticate, sugPost);
router.delete('/suggest/', middleware.authenticate, sugDelete);
router.put('/suggest/', middleware.authenticate, sugPut);

module.exports = router;
