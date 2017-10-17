var express = require('express');
var router = express.Router();

//var PlayerSnakeDetails = require('../models/playerSnakeDetails');
var Users = require('../models/users');
var UsersStats = require('../models/usersStats');
var UsersSnakes = require('../models/usersSnakes');
var DailyStats = require('../models/dailyStats');
var CalculatedStats = require('../models/calculatedStats');


/* GET data page. */
router.get('/data', function (req, res) {
    Users.find(function (err, users) {
        UsersSnakes.find(function (err, usersSnakes) {
            UsersStats.find(function (err, usersStats) {
                DailyStats.find(function (err, dailyStats) {
                    CalculatedStats.find(function (err, calculatedStats) {
                        res.render('data',
                            {
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

module.exports = router;