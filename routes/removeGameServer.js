let express = require('express');
let router = express.Router();

var requestify = require('requestify');
let Users = require('../models/users');


router.get('/', function (req, res, next) {

    res.send("Something");

    next();
});

router.get('/', function (req, res, next) {

    Users.findOne({'cookie_id': "rkrDhmZA-"}, function (err, users) {
        if (err) { return next(err); }
        requestify.post('http://localhost:3000/deadSnake', {usersdata: users});
        console.log('This ran...');
    });

    next();
});

module.exports = router;