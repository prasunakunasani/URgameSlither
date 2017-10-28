
let express = require('express');
let router = express.Router();


router.get('/getData/globaldata', function(req, res) {
    if (req.xhr)
    {
       res.render('globalstats');
    }
});

router.get('/getData/profiledata', function(req, res) {
    if (req.xhr)
    {
        res.render('profilestats');
    }
});
module.exports = router;

