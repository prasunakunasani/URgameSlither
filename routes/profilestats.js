var express = require('express');
var router = express.Router();

router.get('/profilestats', function(req, res, next) {
    res.redirect('/stats'+'#profile');
});

module.exports = router;
