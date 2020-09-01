var express = require('express');
var router = express.Router();

/* GET topic listing. */
router.get('/topic', function(req, res, next) {
  res.send('some json');
});

module.exports = router;
