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

                var tempRecord = {
                    cumulative_moving_average_snake_length: userStatsRecord.cumulative_moving_average_snake_length,
                    interval_data:
                        {
                            averages: [],
                            sums: []
                        },
                    records:
                        {
                            highest_kills: 0,
                            largest_snake_killed_length: 0
                        },
                    totals:
                        {
                            boosts: 0,
                            deaths: 0,
                            duration: 0,
                            kills: 0,
                            length: 0
                        },
                    lastModifiedOn: new Date()
                };

                //update best snake
                if (snakeDetails.length > userStatsRecord.best_snake.length) {
                    tempRecord.best_snake = snakeDetails;
                }

                //  update totals
                tempRecord.totals.boosts = userStatsRecord.totals.boosts + snakeDetails.boosts;
                tempRecord.totals.deaths = userStatsRecord.totals.deaths + 1;
                tempRecord.totals.duration = userStatsRecord.totals.duration + snakeDetails.duration;
                tempRecord.totals.kills = userStatsRecord.totals.kills + snakeDetails.kills;
                tempRecord.totals.length = userStatsRecord.totals.length + snakeDetails.length;

                //update cumulative_moving_average_snake_length
                tempRecord.cumulative_moving_average_snake_length.push(tempRecord.totals.length / tempRecord.totals.deaths);

                //update interval_data
                //fixme - maybe think about what happens when length is less than zero.
                for (var i = 0; i < snakeDetails.interval_data.length.length; i++) {
                    if (userStatsRecord.interval_data.sums[i])
                        tempRecord.interval_data.sums[i] = userStatsRecord.interval_data.sums[i] + snakeDetails.interval_data.length[i];
                    else
                        tempRecord.interval_data.sums[i] = snakeDetails.interval_data.length[i];
                }

                for (var i = 0; i < tempRecord.interval_data.sums.length; i++) {
                    //adding 1 to the death because' for the first record, the deaths haven't been calculated yet.
                    tempRecord.interval_data.averages[i] = tempRecord.interval_data.sums[i] / (userStatsRecord.totals.deaths + 1);
                }

                //update records
                if (snakeDetails.kills > userStatsRecord.records.highest_kills)
                    tempRecord.records.highest_kills = snakeDetails.kills;

                if (snakeDetails.largestSnake > userStatsRecord.records.largest_snake_killed_length)
                    tempRecord.records.largest_snake_killed_length = snakeDetails.largestSnake;

                //update last modified date
                tempRecord.lastModifiedOn = new Date();

                //save the new calculate data into the cookie_id record.
                UsersStats.findOneAndUpdate({cookie_id: snakeDetails.cookie_id}, tempRecord, function (err, result) {

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
