let express = require('express');

let Users = require('../models/users');
let UsersStats = require('../models/usersStats');

class UserService {

    constructor(express) {
        this.express = express;
        this.foo = 10;
    }

    InsertUserDetails(userDetails, next) {

        Users.update({cookie_id: userDetails.cookie_id}, userDetails, {upsert: true}, function (err, result) {
            if (err) return next(err);
            else if (result.ok == '0') return next(JSON.stringify(result));
        });
    }

    UpdateUsersStats(snakeDetails, next) {

        //creating a user stats record if one doesn't exist already
        UsersStats.update({cookie_id: snakeDetails.cookie_id}, {}, {
            upsert: true,
            setDefaultsOnInsert: true
        }, function (err, result) {

            if (err) return next(err);
            else if (result.ok == '0') return next(JSON.stringify(result));

            //Now, find the created/exisiting record with this cookie_id
            UsersStats.findOne({cookie_id: snakeDetails.cookie_id}, function (err, userStatsRecord) {

                // console.log(userStatsRecord);

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

                //update cummulative_moving_average_snake_length
                tempRecord.cumulative_moving_average_snake_length.push(tempRecord.totals.length / tempRecord.totals.deaths);

                //update interval_data
                //fixme - maybe think about what happens when length is less than zero.
                for (var i = 0; i < snakeDetails.interval_data.length.length; i++) {
                    if (userStatsRecord.interval_data.sums[i] != null)
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

                //todo - currently unsure on how to get the largest_snake_killed_length

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
}

module.exports = UserService;

//fixme - Make sure the class diagram functions match the code (capitals and stuff)