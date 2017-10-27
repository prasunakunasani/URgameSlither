let express = require('express');
let router = express.Router();

let Users = require('../models/users');
let UsersStats = require('../models/usersStats');
let UsersSnakes = require('../models/usersSnakes');
let DailyStats = require('../models/dailyStats');
let CalculatedStats = require('../models/calculatedStats');

var cookie_id = "12345";
/*
Find cookie of user that's clicking on this page.
Use that cookie to get data from the users, usersstats, usersnake table.
Display that data by rendering stats.ejs file
*/

router.get('/stats', function (req, res) {
    Users.count({'cookie_id': cookie_id}, function (err, count) {
        UsersStats.findOne({'cookie_id': cookie_id}, function (err, userstats) {
            res.render('stats', {totalgames: count, usersStats: userstats});
        });
    });
});


module.exports = router;

/*
   Users.find(function (err, users) {
        UsersSnakes.find(function (err, usersSnakes) {
            UsersStats.find(function (err, usersStats) {
                DailyStats.find(function (err, dailyStats) {
                    CalculatedStats.find(function (err, calculatedStats) {
                        res.render('stats',
                            {
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
 */