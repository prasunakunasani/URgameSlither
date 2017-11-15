let express = require('express');
let router = express.Router();
//let statsService = require('../services/statsService');

let Users = require('../models/users');
let UsersStats = require('../models/usersStats');
let UsersSnakes = require('../models/userssnakes');
let DailyStats = require('../models/dailyStats');
let CalculatedStats = require('../models/calculatedstats');
var cookie_id = "rkrDhmZA-";

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

function generateKillsChartData(usersStats) {
    var timeOfKillsChartData = [];
    for (var x = 0; x < usersStats.best_snake.interval_data.kills.length; x++) {
        timeOfKillsChartData.push({
            second: x * 5,
            kills: usersStats.best_snake.interval_data.kills[x]
        });
    }
    return timeOfKillsChartData;

};

function generateAllAvgChartData(dailyStats) {
    var avgSnakeLengthAllChartData = [];

    for (var x = 0; x < dailyStats.interval_data.averages.length; x++) {
        avgSnakeLengthAllChartData.push({
            second: x * 5,
            length: dailyStats.interval_data.averages[x]
        });
    }
    return avgSnakeLengthAllChartData;

};

function generateAllHighChartData(dailyStats) {
    var highestSnakeLengthAllChartData = [];

    for (var x = 0; x < dailyStats.interval_data.sums.length; x++) {
        highestSnakeLengthAllChartData.push({
            second: x * 5,
            length: dailyStats.interval_data.sums[x]
        });
    }
    return highestSnakeLengthAllChartData;

};

function secondsToHms(s) {
    return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
};

function getMinutesAgo(date)
{

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}


class StatsController {

    constructor(express) {
        this.express = express;
    }

    Index(req, res, next) {
//fixme - the data for dailystats should come from today's date
        Users.count({'cookie_id': cookie_id}, function (err, count) {
            if (err) {
                return next(err);
            }
            Users.findOne({'cookie_id': cookie_id}, function (err, users) {
                if (err) {
                    return next(err);
                }
                UsersSnakes.find(function (err, usersSnakes) {
                    if (err) {
                        return next(err);
                    }
                    UsersStats.findOne({'cookie_id': cookie_id}, function (err, usersStats) {
                        if (err) {
                            return next(err);
                        } //todo -  check here that the stats are from today. Else, blank and create a new record.
                        DailyStats.findOne({'createdOn': {$lt: new Date().toISOString()}}, function (err, dailyStats) {
                            if (err) {
                                return next(err);
                            }
                            CalculatedStats.find(function (err, calculatedStats) {
                                if (err) {
                                    return next(err);
                                }
                                res.render('stats',
                                    {
                                        totalgames: count,
                                        usersList: users,
                                        usersSnakesList: usersSnakes,
                                        usersStatsList: usersStats,
                                        dailyStatsList: dailyStats,
                                        calculatedStatsList: calculatedStats,
                                        avgSnakeLengths: generateAvgChartData(usersStats),
                                        highestSnakeLengths: generateHighChartData(usersStats),
                                        timeOfKills: generateKillsChartData(usersStats),
                                        avgSnakeLengthAll: generateAllAvgChartData(dailyStats),
                                        highestSnakeLengthAll: generateAllHighChartData(dailyStats),
                                        secondsToHms: secondsToHms,
                                        getMinutesAgo: getMinutesAgo
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

//fixme -  This is probably not the data that needs to be loaded for AJAX calls. Look at Index function.
    AjaxUpdateProfileStats(req, res, next) {
        if (req.xhr) {
            Users.count({'cookie_id': cookie_id}, function (err, count) {
                if (err) {
                    return next(err);
                }
                Users.findOne({'cookie_id': cookie_id}, function (err, users) {
                    if (err) {
                        return next(err);
                    }
                    UsersSnakes.find(function (err, usersSnakes) {
                        if (err) {
                            return next(err);
                        }
                        UsersStats.findOne({'cookie_id': cookie_id}, function (err, usersStats) {
                            if (err) {
                                return next(err);
                            }
                            DailyStats.find(function (err, dailyStats) {
                                if (err) {
                                    return next(err);
                                }
                                CalculatedStats.find(function (err, calculatedStats) {
                                    if (err) {
                                        return next(err);
                                    }
                                    res.render('profilestats',
                                        {
                                            totalgames: count,
                                            //usersList saves the object that came back from the find function and is used in the ejs files
                                            usersList: users,
                                            usersSnakesList: usersSnakes,
                                            usersStatsList: usersStats,
                                            dailyStatsList: dailyStats,
                                            calculatedStatsList: calculatedStats
                                        });
                                });
                            });
                        });
                    });
                });

            });
        }
    }

    AjaxUpdateGlobalStats(req, res, next) {
        if (req.xhr) {
            Users.count({'cookie_id': cookie_id}, function (err, count) {
                if (err) {
                    return next(err);
                }
                Users.findOne({'cookie_id': cookie_id}, function (err, users) {
                    if (err) {
                        return next(err);
                    }
                    UsersSnakes.find(function (err, usersSnakes) {
                        if (err) {
                            return next(err);
                        }
                        UsersStats.findOne({'cookie_id': cookie_id}, function (err, usersStats) {
                            if (err) {
                                return next(err);
                            }
                            DailyStats.find(function (err, dailyStats) {
                                if (err) {
                                    return next(err);
                                }
                                CalculatedStats.find(function (err, calculatedStats) {
                                    if (err) {
                                        return next(err);
                                    }
                                    res.render('globalstats',
                                        {
                                            totalgames: count,
                                            usersList: users,
                                            usersSnakesList: usersSnakes,
                                            usersStatsList: usersStats,
                                            dailyStatsList: dailyStats,
                                            calculatedStatsList: calculatedStats
                                        });
                                });
                            });
                        });
                    });
                });

            });
        }
    }
}

var statsController = new StatsController(express);
router.get('/', statsController.Index.bind(statsController));
router.get('/profilestats', statsController.ProfileStats.bind(statsController));
router.get('/globalstats', statsController.GlobalStats.bind(statsController));
router.get('/ajaxUpdate/profile', statsController.AjaxUpdateProfileStats.bind(statsController));
router.get('/ajaxUpdate/global', statsController.AjaxUpdateGlobalStats.bind(statsController));

module.exports = router;
