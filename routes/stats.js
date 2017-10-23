var express = require('express');
var router = express.Router();


var Users = require('../models/users');
var UsersStats = require('../models/usersStats');
var UsersSnakes = require('../models/usersSnakes');
var DailyStats = require('../models/dailyStats');
var CalculatedStats = require('../models/calculatedStats');


/*
Find cookie of user that's clicking on this page.
Use that cookie to get data from the users, usersstats, usersnake table.
Display that data by rendering stats.ejs file
*/

router.get('/stats', function (req, res) {

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
});

module.exports = router;