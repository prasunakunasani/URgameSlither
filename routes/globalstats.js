let express = require('express');
let router = express.Router();

router.get('/globalstats', function(req, res) {
        res.redirect('/stats'+'#global');
});

module.exports = router;