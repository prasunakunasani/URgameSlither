let express = require('express');

let Users = require('../models/users');
let UsersStats = require('../models/usersStats');

class UserService {

    constructor(express) {
        this.express = express;
        this.foo = 10;
    }

    InsertUserDetails(userDetails, next) {

        Users.count({}, function (err, initCount) {

            Users.update({cookie_id: userDetails.cookie_id}, userDetails, {upsert: true}, function (err, result) {
                if (err) return next(err);
                else if (result.ok == '0') return next(JSON.stringify(result));
                console.log("Done creating a User record");

                Users.count({}, function (err, count) {
                    if (count - initCount > 0) {
                    }
                });
            });
        });

        console.log('The InsertUserDetails function ran');
    }

    UpdateUsersStats(snakeDetails, next) {

        UsersStats.update({cookie_id: snakeDetails.cookie_id}, {}, {
            upsert: true,
            setDefaultsOnInsert: true
        }, function (err, result) {
            if (err) return next(err);
            else if (result.ok == '0') return next(JSON.stringify(result));
            console.log("Done creating a UserStats record");

            UsersStats.findOne({cookie_id: snakeDetails.cookie_id}, function (err, userStatsRecord) {

                var tempRecord = {

                    totals:
                        {
                            boosts: 0,
                            deaths:0,
                            duration:0,
                            kills:0,
                            length:0
                        }
                }

                //update best snake

                // console.log("Here, trying to use best_snake");
                // if (snakeDetails.length > userStatsRecord.best_snake.length)
                // {
                //     console.log("The new snake is bigger!!");
                //     tempRecord.best_snake = snakeDetails;
                // }

                //  update totals
                tempRecord.totals.boosts = userStatsRecord.totals.boosts + snakeDetails.boosts;
                tempRecord.totals.deaths = userStatsRecord.totals.deaths + 1;
                tempRecord.totals.duration = userStatsRecord.totals.duration + snakeDetails.duration;
                tempRecord.totals.kills = userStatsRecord.totals.kills + snakeDetails.kills;
                tempRecord.totals.length = userStatsRecord.totals.length + snakeDetails.length;

                //update cummulative_moving_average_snake_length


                //update interval_data

                //update records
                //check if higher than highest kill, check if larger than largest snake killed, if yes, update


                //update last modified date

                UsersStats.findOneAndUpdate({cookie_id: snakeDetails.cookie_id}, tempRecord, function (err, result) {

                    if (err) return next(err);
                    else if (result.ok == '0') return next(JSON.stringify(result));

                });
            });

        });
        console.log('The UpdateUsersStats function ran.');
    }

}

module.exports = UserService;

//fixme - Make sure the class diagram functions match the code (capitals and stuff)