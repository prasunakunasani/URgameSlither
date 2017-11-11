let express = require('express');
let CalculatedStats = require('../models/calculatedstats');
let Users = require('../models/users');
let DailyStats = require('../models/dailyStats');
//var CachedVariables = require('../routes/cachedStatsSingleton');
//let instance = null;
let calculatedstats = '';
let uniqueUsers = 0;

Users.count({'updatedAt': {$lt: new Date().toISOString()}}, function (err, count) {
    uniqueUsers = count;
});

class StatsService {

    constructor(express) {

        this.express = express;

        // this.cachedCalculatedStats = {
        //     totals:
        //         {
        //             all_time:
        //                 {
        //                     boosts: calculatedstats.totals.all_time.boosts,
        //                     deaths: calculatedstats.totals.all_time.deaths,
        //                     duration: calculatedstats.totals.all_time.duration,
        //                     kills: calculatedstats.totals.all_time.kills,
        //                     length: calculatedstats.totals.all_time.length,
        //                     uniques: calculatedstats.totals.all_time.uniques
        //                 }
        //         }
        // };

        // this.cachedDailyStats = {
        //     createdOn: dailystats.createdOn,
        //     peak:
        //         {
        //             concurrent: dailystats.peak.concurrent,
        //             time: dailystats.peak.time
        //         },
        //     totals:
        //         {
        //             boosts: dailystats.totals.boosts,
        //             deaths: dailystats.totals.deaths,
        //             duration: dailystats.totals.duration,
        //             kills: dailystats.totals.kills,
        //             length: dailystats.totals.length,
        //             unique_users: dailystats.totals.unique_users
        //         }
        // };

        // if (!instance) {
        //     instance = this;
        // }
        //
        // return instance;
    }

    UpdateDailyStats(snakeDetails, playerCount, next) {

        //var statsCache = new CachedVariables(express,0,calculatedstats);

        DailyStats.update({'createdOn': {$lt: new Date().toISOString()}}, {}, {
            upsert: true,
            setDefaultsOnInsert: true
        }, function (err, result) {

            if (err) return next(err);
            else if (result.ok == '0') return next(JSON.stringify(result));


            DailyStats.findOne({'createdOn': {$lt: new Date().toISOString()}}, function (err, dailystats) {

                var tempRecord = {
                    interval_data:
                        {
                            averages: [],
                            sums: []
                        },
                    peak:
                        {
                            concurrent: 0,
                            time: dailystats.peak.time
                        },
                    totals:
                        {
                            boosts: 0,
                            deaths: 0,
                            duration: 0,
                            kills: 0,
                            length: 0,
                            unique_users: 0
                        }
                };
                //Calculate the interval_data
                for (var i = 0; i < snakeDetails.interval_data.length.length; i++) {
                    if (dailystats.interval_data.sums[i] != null)
                        tempRecord.interval_data.sums[i] = dailystats.interval_data.sums[i] + snakeDetails.interval_data.length[i];
                    else
                        tempRecord.interval_data.sums[i] = snakeDetails.interval_data.length[i];
                }

                for (var i = 0; i < tempRecord.interval_data.sums.length; i++) {
                    //adding 1 to the death because' for the first record, the deaths haven't been calculated yet.
                    tempRecord.interval_data.averages[i] = tempRecord.interval_data.sums[i] / (dailystats.totals.deaths + 1);
                }

                //calculate the peak
                if (playerCount > dailystats.peak.concurrent) {
                    tempRecord.peak.concurrent = playerCount;
                    tempRecord.peak = new Date();
                }

                //calculate the totals
                tempRecord.totals.boosts = dailystats.totals.boosts + snakeDetails.boosts;
                tempRecord.totals.deaths = dailystats.totals.deaths + 1;
                tempRecord.totals.duration = dailystats.totals.duration + snakeDetails.duration;
                tempRecord.totals.kills = dailystats.totals.kills + snakeDetails.kills;
                tempRecord.totals.length = dailystats.totals.length + snakeDetails.length;
                tempRecord.totals.unique_users = dailystats.totals.unique_users + uniqueUsers;

                if ((dailystats.totals.unique_users === null) || (dailystats.totals.unique_users < uniqueUsers)) {
                    tempRecord.totals.unique_users = uniqueUsers;
                }

                DailyStats.findOneAndUpdate({'createdOn': {$lt: new Date().toISOString()}}, tempRecord, function (err, result) {
                    if (err) return next(err);
                    else if (result.ok == '0') return next(JSON.stringify(result));

                });

            });

        });

    }

    UpdateCalculatedStats(snakeDetails, next) {
        CalculatedStats.findOne({_id: '5a04b2fc05644d0ab5bb3220'}, function (err, calcstats) {

            var tempRecord = {
                totals:
                    {
                        all_time:
                            {
                                boosts: 0,
                                deaths: 0,
                                duration: 0,
                                kills: 0,
                                length: 0,
                                unique_users: 0
                            }
                    }
            };

            //calculate totals:
            tempRecord.totals.all_time.boosts = calcstats.totals.all_time.boosts + snakeDetails.boosts;
            tempRecord.totals.all_time.deaths = calcstats.totals.all_time.deaths + 1;
            tempRecord.totals.all_time.duration = calcstats.totals.all_time.duration + snakeDetails.duration;
            tempRecord.totals.all_time.kills = calcstats.totals.all_time.kills + snakeDetails.kills;
            tempRecord.totals.all_time.length = calcstats.totals.all_time.length + snakeDetails.length;

            //tempRecord.totals.unique_users = calcstats.totals.unique_users + uniqueUsers;

            CalculatedStats.findOneAndUpdate({_id: '5a04b2fc05644d0ab5bb3220'}, tempRecord, function (err, result) {
                if (err) return next(err);
                else if (result.ok == '0') return next(JSON.stringify(result));

            });

        });

    }

}

module.exports = StatsService;
