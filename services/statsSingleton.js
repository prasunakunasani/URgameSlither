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

        if (!instance) {
            instance = this;
        }

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

        //todo - check if good data - check if day flipped over. - what was this again? Chris mentioned it..ask him

        DailyStats.update({'createdOn': {$gt: startOfToday}}, {}, {
            upsert: true,
            setDefaultsOnInsert: true
        }, function (err, result) {

            if (err) return next(err);
            else if (result.ok == '0') return next(JSON.stringify(result));


            var tempRecord = {
                interval_data:
                    {
                        averages: [],
                        sums: []
                    },
                peak:
                    {
                        concurrent: 0,
                        time: this.cachedDailyStats.peak.time
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
                if (this.cachedDailyStats.interval_data.sums[i] != null)
                    tempRecord.interval_data.sums[i] = this.cachedDailyStats.interval_data.sums[i] + snakeDetails.interval_data.length[i];
                else
                    tempRecord.interval_data.sums[i] = snakeDetails.interval_data.length[i];
            }

            for (var i = 0; i < tempRecord.interval_data.sums.length; i++) {
                //adding 1 to the death because' for the first record, the deaths haven't been calculated yet.
                tempRecord.interval_data.averages[i] = tempRecord.interval_data.sums[i] / (this.cachedDailyStats.totals.deaths + 1);
            }

            //calculate the peak
            if (this.cachedDailyStats.peak.concurrent < playerCount) {
                tempRecord.peak.concurrent = playerCount;
                tempRecord.peak.time = new Date();
            }

            //calculate the totals
            tempRecord.totals.boosts = this.cachedDailyStats.totals.boosts + snakeDetails.boosts;
            tempRecord.totals.deaths = this.cachedDailyStats.totals.deaths + 1;
            tempRecord.totals.duration = this.cachedDailyStats.totals.duration + snakeDetails.duration;
            tempRecord.totals.kills = this.cachedDailyStats.totals.kills + snakeDetails.kills;
            tempRecord.totals.length = this.cachedDailyStats.totals.length + snakeDetails.length;

            Users.count({'updatedAt': {$gt: startOfToday}}, function (err, uniqueUsers) {
                if (err) return next(err);

                tempRecord.totals.unique_users = this.cachedDailyStats.totals.unique_users + uniqueUsers;

                if ((this.cachedDailyStats.totals.unique_users === null) || (this.cachedDailyStats.totals.unique_users < uniqueUsers)) {
                    tempRecord.totals.unique_users = uniqueUsers;
                }

                DailyStats.findOneAndUpdate({'createdOn': {$gt: startOfToday}}, tempRecord, function (err, result) {
                    if (err) return next(err);

                    //find record that's either created after or at the same time as correct dialy record. But make sure it's a duplicate created after start of today.
                    DailyStats.findOneAndRemove({$and:[{$or: [{'createdOn': {$gt: result.createdOn}}, {'updatedAt': {$lt: result.updatedAt}}]},{'createdAt': {$gt: startOfToday}}]}, function (err, result2) {
                        if (err) return next(err);
                    });
                });

            }.bind(this));
        }.bind(this));
    }

    UpdateCalculatedStats(snakeDetails, next) {

        var tempRecord = {
            totals:
                {
                    all_time:
                        {
                            boosts: 0,
                            deaths: 0,
                            duration: 0,
                            kills: 0,
                            length: 0
                        }
                }
        };

        tempRecord.totals.all_time.boosts = this.cachedCalculatedStats.totals.all_time.boosts + snakeDetails.boosts;
        tempRecord.totals.all_time.deaths = this.cachedCalculatedStats.totals.all_time.deaths + 1;
        tempRecord.totals.all_time.duration = this.cachedCalculatedStats.totals.all_time.duration + snakeDetails.duration;
        tempRecord.totals.all_time.kills = this.cachedCalculatedStats.totals.all_time.kills + snakeDetails.kills;
        tempRecord.totals.all_time.length = this.cachedCalculatedStats.totals.all_time.length + snakeDetails.length

        CalculatedStats.findOneAndUpdate({}, tempRecord, function (err, result) {
            if (err) return next(err);
            //find record that's either created after or at the same time as correct dialy record. But make sure it's a duplicate created after start of today.
            CalculatedStats.findOneAndRemove({$and:[{$or: [{'createdAt': {$gt: result.createdAt}}, {'updatedAt': {$lt: result.updatedAt}}]},{'createdAt': {$gt: startOfToday}}]}, function (err, result2) {
                if (err) return next(err);
            });
        });
    }

}

module.exports = StatsSingleton;
