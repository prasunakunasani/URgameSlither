//todo - make AJAX request stuff working

let express = require('express');
let router = express.Router();
//var _ = require('underscore');
let statsService = require('../services/statsService');


let Users = require('../models/users');
let UsersStats = require('../models/usersStats');
let UsersSnakes = require('../models/userssnakes');
let DailyStats = require('../models/dailyStats');
let CalculatedStats = require('../models/calculatedstats');
var cookie_id = "rkrDhmZA-";
var tempHOlder = [];

function generateAvgChartData(usersStats) {

    var avgSnakeLengthChartData = [];

    for (var x = 0; x < usersStats.interval_data.averages.length; x++) {
        avgSnakeLengthChartData.push({
            second: x * 5,
            length: usersStats.interval_data.averages[x]
        });

    }
    return avgSnakeLengthChartData;
};

function generateHighChartData(usersStats) {

    var highestSnakeLengthChartData = [];

    for (var x = 0; x < usersStats.interval_data.sums.length; x++) {
        highestSnakeLengthChartData.push({
            second: x * 5,
            length: usersStats.interval_data.sums[x]
        });

    }
    return highestSnakeLengthChartData;
};

class StatsController {

    constructor(express) {
        this.express = express;
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
                                        avgSnakeLengths: generateAvgChartData(usersStats),
                                        highestSnakeLengths: generateHighChartData(usersStats)
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
//Could've also done _.bindAll(statsController,'Index') and then called Index as the second parameter below;
router.get('/', statsController.Index.bind(statsController));
router.get('/profilestats', statsController.ProfileStats.bind(statsController));
router.get('/globalstats', statsController.GlobalStats.bind(statsController));

module.exports = router;

/*

FROM INDEX FILE TO TEST SINGLETON
var test = new statsService(express);

        console.log(test.time);

        setTimeout(function(){
            var test = new statsService(express);
            console.log(test.time);
            console.log(test.cachedCalculatedStats);
        },4000);
 */