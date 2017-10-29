//todo - make AJAX request stuff working

let express = require('express');
let router = express.Router();
//var _ = require('underscore');

let Users = require('../models/users');
let UsersStats = require('../models/usersStats');
let UsersSnakes = require('../models/usersSnakes');
let DailyStats = require('../models/dailyStats');
let CalculatedStats = require('../models/calculatedStats');
var cookie_id = "rkrDhmZA-";

class StatsController {

    constructor(express) {
        this.express = express;
       // this.foo = 10;
    }


    Index(req, res, next) {

        Users.count({'cookie_id': cookie_id}, function (err, count) {
            Users.findOne({'cookie_id': cookie_id}, function (err, users) {
                UsersSnakes.find(function (err, usersSnakes) {
                    UsersStats.findOne({'cookie_id': cookie_id}, function (err, usersStats) {
                        DailyStats.find(function (err, dailyStats) {
                            CalculatedStats.find(function (err, calculatedStats) {
                                res.render('stats',
                                    {
                                        totalgames: count,
                                        //usersList saves the object that came back from the find function and is used in the ejs files
                                        usersList: users,
                                        usersSnakesList: usersSnakes,
                                        usersStatsList: usersStats,
                                        dailyStatsList: dailyStats,
                                        calculatedStatsList: calculatedStats,

                                    });
                            });
                        });
                    });
                });
            });

        });
    }

    ProfileStats(req, res, next) {
        res.redirect('/stats' + '#profile');


    }

    GlobalStats(req, res, next) {
        res.redirect('/stats' + '#global');
    }

}

var statsController = new StatsController(express);
//_.bindAll(statsController,'Index');
router.get('/', statsController.Index.bind(statsController));
router.get('/profilestats', statsController.ProfileStats.bind(statsController));
router.get('/globalstats', statsController.GlobalStats.bind(statsController));

module.exports = router;
