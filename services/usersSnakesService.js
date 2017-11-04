let express = require('express');
let UsersSnakes = require('../models/userssnakes');

class UsersSnakesService {

    constructor(express) {
        this.express = express;
        this.foo = 10;
    }

    InsertUsersSnakeData(snakeDetails, next) {

        var saveSnakeDetails = new UsersSnakes({

            cookie_id: snakeDetails.cookie_id,
            boost_count: snakeDetails.boost_count,
            duration: snakeDetails.duration,
            interval_data:
                {
                    length: snakeDetails.interval_data.length,
                    kills: snakeDetails.interval_data.kills
                },
            kill_count: snakeDetails.kill_count,
            length: snakeDetails.length
        });

        saveSnakeDetails.save(function (err) {
            if (err) return next(err);
            console.log('Player saved successfully!');
        });
    }

    InsertUsersStatsData(req, res, next) {
        res.send('Insert');
    }

}

module.exports = UsersSnakesService;
