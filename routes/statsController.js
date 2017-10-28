let express = require('express');
let router = express.Router();
//var _ = require('underscore');
let users = require('../models/users')

class StatsController{


    constructor(express) {
        this.express = express;
        this.foo = 10;
    }


    Index(req, res, next){
       // res.json({foo: this.foo}); // TypeError: Cannot read property 'foo' of undefined
        users.findOne({'cookie_id': "rkrDhmZA-"}, function (err, usersdata) {

            res.json( {usersdata: usersdata});
        });
    }

}

var statsController = new StatsController(express);
//_.bindAll(statsController,'Index');
router.get('/', statsController.Index.bind(statsController));

module.exports = router;
