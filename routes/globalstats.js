var express = require('express');
var router = express.Router();

router.get('/globalstats', function(req, res, next) {
    res.redirect('/stats'+'#global');
});

module.exports = router;
