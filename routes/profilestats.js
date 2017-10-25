let express = require('express');
let router = express.Router();

router.get('/profilestats', function(req, res) {
    res.redirect('/stats'+'#profile');
});

module.exports = router;
