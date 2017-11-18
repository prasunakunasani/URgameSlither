let express = require('express');
let CalculatedStats = require('../models/calculatedstats');
let Users = require('../models/users');
let DailyStats = require('../models/dailyStats');
let instance = null;
var now = new Date();
var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

class StatsSingleton {

    constructor(express) {

        this.foo = 10;

        this.express = express;

        //if instance is null
        if (!instance) {
            instance = this;
        }
        else
            return instance;

        DailyStats.findOne({'createdOn': {$gt: startOfToday}}, function (err, result) {

            if (!result) {
                result = new DailyStats();

                result.save(function (err) {
                    if (err) console.error(err);
                })
            }
            this.cachedDailyStats = result;
        }.bind(this));

        CalculatedStats.findOne({}, function (err, result) {

            if (!result) {
                result = new CalculatedStats();

                result.save(function (err) {
                    if (err) console.error(err);
                })
            }
            this.cachedCalculatedStats = result;
        }.bind(this));

        return instance;
    }

    GetCalculatedStats(res, next, Callback) {
        CalculatedStats.findOne({}, function (err, calculatedStats) {
            if (err) {
                return next(err);
            }
            if (!calculatedStats) {
                new CalculatedStats();
            }
            Callback(calculatedStats);
        });
    }

    GetDailyStats(res, next, Callback) {
        DailyStats.findOne({'createdOn': {$gt: startOfToday}}, function (err, dailyStats) {
            if (err) {
                return next(err);
            }
            if (!dailyStats) {
                new DailyStats();
            }

            Callback(dailyStats);
        });
    }

    UpdateDailyStats(snakeDetails, playerCount, next) {

        DailyStats.findOneAndUpdate({'createdOn': {$gt: startOfToday}}, {}, {
            upsert: true,
            setDefaultsOnInsert: true
        }, function (err, dailyStats) {

            if (err) return next(err);

            //Calculate the interval_data
            for (var i = 0; i < snakeDetails.interval_data.length.length; i++) {
                if (this.cachedDailyStats.interval_data.sums[i] != null)
                    dailyStats.interval_data.sums[i] = this.cachedDailyStats.interval_data.sums[i] + snakeDetails.interval_data.length[i];
                else
                    dailyStats.interval_data.sums[i] = snakeDetails.interval_data.length[i];
            }

            for (var i = 0; i < dailyStats.interval_data.sums.length; i++) {
                //adding 1 to the death because' for the first record, the deaths haven't been calculated yet.
                dailyStats.interval_data.averages[i] = dailyStats.interval_data.sums[i] / (this.cachedDailyStats.totals.deaths + 1);
            }

            //calculate the peak
            if (this.cachedDailyStats.peak.concurrent < playerCount) {
                dailyStats.peak.concurrent = playerCount;
                dailyStats.peak.time = new Date();
            }

            //calculate the totals
            dailyStats.totals.boosts = this.cachedDailyStats.totals.boosts + snakeDetails.boosts;
            dailyStats.totals.deaths = this.cachedDailyStats.totals.deaths + 1;
            dailyStats.totals.duration = this.cachedDailyStats.totals.duration + snakeDetails.duration;
            dailyStats.totals.kills = this.cachedDailyStats.totals.kills + snakeDetails.kills;
            dailyStats.totals.length = this.cachedDailyStats.totals.length + snakeDetails.length;

            Users.count({'updatedAt': {$gt: startOfToday}}, function (err, uniqueUsers) {
                if (err) return next(err);

                dailyStats.totals.unique_users = this.cachedDailyStats.totals.unique_users + uniqueUsers;

                if ((this.cachedDailyStats.totals.unique_users === null) || (this.cachedDailyStats.totals.unique_users < uniqueUsers)) {
                    dailyStats.totals.unique_users = uniqueUsers;
                }

                DailyStats.findOneAndUpdate({'createdOn': {$gt: startOfToday}}, dailyStats, function (err, result) {
                    if (err) return next(err);
                });

            }.bind(this));
        }.bind(this));
    }

    UpdateCalculatedStats(snakeDetails, next) {

        CalculatedStats.findOne({}, function (err,calculatedStats) {

            if (!calculatedStats)
            {
                return next("Calculated stats in UpdateCalculatedStats in statsSingleton returned null");
            }

            calculatedStats.totals.all_time.boosts = this.cachedCalculatedStats.totals.all_time.boosts + snakeDetails.boosts;
            calculatedStats.totals.all_time.deaths = this.cachedCalculatedStats.totals.all_time.deaths + 1;
            calculatedStats.totals.all_time.duration = this.cachedCalculatedStats.totals.all_time.duration + snakeDetails.duration;
            calculatedStats.totals.all_time.kills = this.cachedCalculatedStats.totals.all_time.kills + snakeDetails.kills;
            calculatedStats.totals.all_time.length = this.cachedCalculatedStats.totals.all_time.length + snakeDetails.length

            CalculatedStats.findOneAndUpdate({}, calculatedStats, function (err, result) {
                if (err) return next(err);
            });

        }.bind(this));
    }

}

module.exports = StatsSingleton;
