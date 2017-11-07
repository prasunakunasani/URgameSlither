var express = require('express');
var router = express.Router();
var oauth2 = require('../lib/oauth2');

// Use the oauth middleware to automatically get the user's profile
// information and expose login/logout URLs to templates. The data from the template can be used in the view
router.use(oauth2.template);

/* GET home page. */
router.get('/', function(req, res, next) {

    //console.log(req);
    next();
});

router.get('/', function(req, res) {

    res.redirect('/game');
});


module.exports = router;

