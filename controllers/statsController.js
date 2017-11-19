let express = require('express');
let router = express.Router();

var UserService = require('../services/userService');
var StatsSingleton = require('../services/statsSingleton');

var globalFunctions = new StatsSingleton(express);


function generateAvgChartData(usersStats) {

    var avgSnakeLengthChartData = [];

    if (!usersStats || usersStats.interval_data.averages.length == 0) {
        return [{
            second: 0,
            length: 0
        }];
    }

    for (var x = 0; x < usersStats.interval_data.averages.length; x++) {
        avgSnakeLengthChartData.push({
            second: x * 5,
            length: (usersStats.interval_data.averages[x]).toFixed(1)
        });
    }

    return avgSnakeLengthChartData;
};

function generateHighChartData(usersStats) {

    var highestSnakeLengthChartData = [];

    if (!usersStats || usersStats.interval_data.sums.length == 0) {
        return [{
            second: 0,
            length: 0
        }];
    }

    for (var x = 0; x < usersStats.interval_data.sums.length; x++) {
        highestSnakeLengthChartData.push({
            second: x * 5,
            length: usersStats.interval_data.sums[x]
        });
    }

    return highestSnakeLengthChartData;
};

function generateCumulativeMovingScoreData(userStats) {
    var cumulativeMovingScoreChartData = [];

    if (!userStats || userStats.cumulative_moving_average_snake_length.length == 0) {
        return [{
            game: 0,
            score: 0
        }];
    }

    for (var x = 0; x < userStats.cumulative_moving_average_snake_length.length; x++) {
        cumulativeMovingScoreChartData.push(
            {
                game: x + 1,
                score: (userStats.cumulative_moving_average_snake_length[x]).toFixed(1)
            }
        );
    }

    return cumulativeMovingScoreChartData;
}

function generateBestScoreAndKillsChartData(usersStats) {
    var bestScoreAndKillsChartData = [];

    if (!usersStats || usersStats.best_snake.interval_data.length.length == 0) {
        return [{
            second: 0,
            length: 0,
            kills: 0
        }];
    }

    for (var x = 0; x < usersStats.best_snake.interval_data.length.length; x++) {
        bestScoreAndKillsChartData.push({
            second: x * 5,
            length: usersStats.best_snake.interval_data.length[x],
            kills: usersStats.best_snake.interval_data.kills[x]
        });
    }

    return bestScoreAndKillsChartData;
};

function generateAllAvgChartData(dailyStats) {
    var avgSnakeLengthAllChartData = [];

    if (!dailyStats || dailyStats.interval_data.averages.length == 0) {
        return [{
            second: 0,
            length: 0
        }];
    }

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

    if (!dailyStats || dailyStats.interval_data.sums.length == 0) {
        return [{
            second: 0,
            length: 0
        }];
    }

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

function getMinutesAgo(date) {

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

        var cookie_id = req.cookies.cookie_id;

        UserService.GetUsers(cookie_id, res, next, function (users) {
            UserService.GetUsersStats(cookie_id, res, next, function (usersStats) {
                globalFunctions.GetDailyStats(res, next, function (dailyStats) {
                    globalFunctions.GetCalculatedStats(res, next, function (calculatedStats) {
                        res.render('stats',
                            {
                                //Same as: If users is not null, send users. Else, create a new Users model and send that.
                                usersList: users,
                                usersStatsList: usersStats,
                                dailyStatsList: dailyStats,
                                calculatedStatsList: calculatedStats,
                                avgSnakeLengths: generateAvgChartData(usersStats),
                                highestSnakeLengths: generateHighChartData(usersStats),
                                bestScoreAndKills: generateBestScoreAndKillsChartData(usersStats),
                                cumulativeMovingScore: generateCumulativeMovingScoreData(usersStats),
                                avgSnakeLengthAll: generateAllAvgChartData(dailyStats),
                                highestSnakeLengthAll: generateAllHighChartData(dailyStats),
                                secondsToHms: secondsToHms,
                                getMinutesAgo: getMinutesAgo
                            }); //for res.render
                    }); //for  globalFunctions.GetCalculatedStats
                }); //for globalFunctions.GetDailyStats
            }); //for UserService.GetUsersStats
        });//for UserService.GetUsers
    }

    ProfileStats(req, res, next) {
        res.redirect('/stats' + '#profile');
    }

    GlobalStats(req, res, next) {
        res.redirect('/stats' + '#global');
    }

//fixme -  Fix all the stupid Ajax calls. Chris suggested to first see if data is loaded. If yes, then just get JSON and update. Else, call the Index function.
    AjaxUpdateProfileStats(req, res, next) {
        if (req.xhr) {
            var cookie_id = req.cookies.cookie_id;
            UserService.GetUsers(cookie_id, res, next, function (users) {
                UserService.GetUsersStats(cookie_id, res, next, function (usersStats) {
                    globalFunctions.GetDailyStats(res, next, function (dailyStats) {
                        globalFunctions.GetCalculatedStats(res, next, function (calculatedStats) {
                            res.render('profilestats',
                                {
                                    usersList: users,
                                    usersStatsList: usersStats,
                                    dailyStatsList: dailyStats,
                                    calculatedStatsList: calculatedStats
                                }); //for res.render
                        }); //for  globalFunctions.GetCalculatedStats
                    }); //for globalFunctions.GetDailyStats
                }); //for UserService.GetUsersStats
            });//for UserService.GetUsers
        }
    }

    AjaxUpdateGlobalStats(req, res, next) {
        if (req.xhr) {
            var cookie_id = req.cookies.cookie_id;
            UserService.GetUsers(cookie_id, res, next, function (users) {
                UserService.GetUsersStats(cookie_id, res, next, function (usersStats) {
                    globalFunctions.GetDailyStats(res, next, function (dailyStats) {
                        globalFunctions.GetCalculatedStats(res, next, function (calculatedStats) {
                            res.render('globalstats',
                                {
                                    usersList: users,
                                    usersStatsList: usersStats,
                                    dailyStatsList: dailyStats,
                                    calculatedStatsList: calculatedStats
                                }); //for res.render
                        }); //for  globalFunctions.GetCalculatedStats
                    }); //for globalFunctions.GetDailyStats
                }); //for UserService.GetUsersStats
            });//for UserService.GetUsers
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
