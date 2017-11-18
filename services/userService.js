let express = require('express');

let Users = require('../models/users');
let UsersStats = require('../models/usersStats');
let UsersSnakes = require('../models/userssnakes');

class UserService {

    constructor(express) {
        this.express = express;
    }

    static GetUsers(cookie_id, res, next, Callback) {
        Users.findOne({'cookie_id': cookie_id}, function (err, users) {
            if (err) {
                return next(err);
            }

            if (!users) {
                users= new Users();
            }

            Callback(users);
        });
    }

    //not being used for now
    static GetUsersSnakes(res, next, Callback) {
        UsersSnakes.find(function (err, usersSnakes) {
            if (err) {
                return next(err);
            }
            if (!usersSnakes) {
                usersSnakes=  new UsersSnakes();
            }

            Callback(usersSnakes);
        });
    }

    static GetUsersStats(cookie_id, res, next, Callback) {
        UsersStats.findOne({'cookie_id': cookie_id}, function (err, usersStats) {
            if (err) {
                return next(err);
            }
            if (!usersStats) {
                usersStats= new UsersStats({best_snake: new UsersSnakes()}); //cause' best_snake can't be defaulted in the model
            }

            Callback(usersStats);
        });
    }

    static UpdateUsers(userDetails, next) {

        Users.update({cookie_id: userDetails.cookie_id}, userDetails, {upsert: true}, function (err, result) {

            if (err) return next("Can't run Users.update in userService: "+err);
            else if (result.ok == '0') return next("Result from Users.update in UserService: "+JSON.stringify(result));
        });
    }

    static UpdateUsersStats(snakeDetails, next) {

        //creating a user stats record if one doesn't exist already
        UsersStats.update({cookie_id: snakeDetails.cookie_id}, {}, {
            upsert: true,
            setDefaultsOnInsert: true
        }, function (err, result) {

            if (err) return next("UsersStats.update didn't work in UserService: "+err);
            else if (result.ok == '0') return next("Result from UsersStats.update in UserService: "+JSON.stringify(result));

            //Now, find the created/exisiting record with this cookie_id
            UsersStats.findOne({cookie_id: snakeDetails.cookie_id}, function (err, userStatsRecord) {

                if (!userStatsRecord)
                    userStatsRecord = new UsersStats();

                //update best snake
                if (snakeDetails.length > userStatsRecord.best_snake.length) {
                    userStatsRecord.best_snake = snakeDetails;
                }

                //  update totals
                userStatsRecord.totals.boosts = userStatsRecord.totals.boosts + snakeDetails.boosts;
                userStatsRecord.totals.deaths = userStatsRecord.totals.deaths + 1;
                userStatsRecord.totals.duration = userStatsRecord.totals.duration + snakeDetails.duration;
                userStatsRecord.totals.kills = userStatsRecord.totals.kills + snakeDetails.kills;
                userStatsRecord.totals.length = userStatsRecord.totals.length + snakeDetails.length;

                //update cumulative_moving_average_snake_length
                userStatsRecord.cumulative_moving_average_snake_length.push(userStatsRecord.totals.length / userStatsRecord.totals.deaths);

                //update interval_data
                //fixme - maybe think about what happens when length is less than zero.
                for (var i = 0; i < snakeDetails.interval_data.length.length; i++) {
                    if (userStatsRecord.interval_data.sums[i])
                        userStatsRecord.interval_data.sums[i] = userStatsRecord.interval_data.sums[i] + snakeDetails.interval_data.length[i];
                    else
                        userStatsRecord.interval_data.sums[i] = snakeDetails.interval_data.length[i];
                }

                for (var i = 0; i < snakeDetails.interval_data.length.length; i++) {
                    //adding 1 to the death because' for the first record, the deaths haven't been calculated yet.
                    userStatsRecord.interval_data.averages[i] = userStatsRecord.interval_data.sums[i] / (userStatsRecord.totals.deaths + 1);
                }

                //update records
                if (snakeDetails.kills > userStatsRecord.records.highest_kills)
                    userStatsRecord.records.highest_kills = snakeDetails.kills;

                if (snakeDetails.largestSnake > userStatsRecord.records.largest_snake_killed_length)
                    userStatsRecord.records.largest_snake_killed_length = snakeDetails.largestSnake;

                //update last modified date
                userStatsRecord.lastModifiedOn = new Date();

                //save the new calculate data into the cookie_id record.
                UsersStats.findOneAndUpdate({cookie_id: snakeDetails.cookie_id}, userStatsRecord, function (err, result) {
                    if (err) return next(err);
                    else if (result.ok == '0') return next(JSON.stringify(result));

                });
            });

        });
    }

    static InsertUsersSnake(snakeDetails, next) {

        const saveSnakeDetails = new UsersSnakes(snakeDetails);

        saveSnakeDetails.save(function (err) {
            if (err) return next("InsertUsersSnake wasn't able to save snake: "+err);
        });
    }

}

module.exports = UserService;
