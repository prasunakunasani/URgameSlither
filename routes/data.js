var express = require('express');
var router = express.Router();

var Players = require('../models/players');
var PlayerSnakeDetails = require('../models/playerSnakeDetails');

/* GET data page. */
router.get('/data', function (req, res) {
    Players.find(function (err, players) {
        PlayerSnakeDetails.find(function (err, playerSnakeDetails) {
            res.render('data',
                {
                    //playersList saves the object that came back from the find function and is used in the ejs files
                    playersList: players,
                    playerSnakeDetailsList: playerSnakeDetails
                });
        });
    });
});

module.exports = router;