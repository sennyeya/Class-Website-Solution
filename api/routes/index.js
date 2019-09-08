var express = require('express');
var html = require('../test');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.send(await html.test());
});

module.exports = router;
