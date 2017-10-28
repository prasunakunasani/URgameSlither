var express = require('express');
var router = express.Router();
var oauth2 = require('../lib/oauth2');

// Use the oauth middleware to automatically get the user's profile
// information and expose login/logout URLs to templates. The data from the template can be used in the view
router.use(oauth2.template);

router.get('/', function (req, res) {

    res.render('index', {title: 'Terrible'});
});


module.exports = router;


/* FOR TEST-POST

var requestify = require('requestify');
let Users = require('../models/users');

router.get('/', function (req, res, next) {


    Users.findOne({'cookie_id': "rkrDhmZA-"}, function (err, users) {

        requestify.post('http://localhost:3000/test', {usersdata: users});
    });

    next();
});
*/

/*
In a different file, :

router.post('/test', function (req,res) {

    console.log(req.body);

});

*/
