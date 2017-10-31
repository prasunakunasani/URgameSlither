let express = require('express');
let calculatedStats = require('../models/calculatedstats');
let instance = null;
let calculatedstats = '';
let todaysdate = new Date();

calculatedStats.findOne({_id: '59f7963076e17b9677bc56c0'}, function (err, calcstats) {
    calculatedstats = calcstats;
});

class StatsService {

    constructor(express) {

        if (!instance) {
            instance = this;
        }

        this.express = express;
        this.cachedCalculatedStats = {
            totals:
                {
                    all_time:
                        {
                            boosts: calculatedstats.totals.all_time.boosts,
                            deaths: calculatedstats.totals.all_time.deaths,
                            duration: calculatedstats.totals.all_time.duration,
                            kills: calculatedstats.totals.all_time.kills,
                            length: calculatedstats.totals.all_time.length,
                            uniques: calculatedstats.totals.all_time.uniques
                        }
                }
        };

        // this.cachedDailyStats = {
        //     createdOn: dailyStats.createdOn,
        //     peak:
        //         {
        //             concurrent: dailyStats.peak.concurrent,
        //             time: dailyStats.peak.time
        //         },
        //     totals:
        //         {
        //             boosts: dailyStats.totals.boosts,
        //             deaths: dailyStats.totals.deaths,
        //             duration: dailyStats.totals.duration,
        //             kills: dailyStats.totals.kills,
        //             length: dailyStats.totals.length,
        //             unique_users: dailyStats.totals.unique_users
        //         }
        // };

        return instance;
    }

    GetCalculatedStats(req, res, next) {
        res.send('GetCalculatedStats');
    }

    GetDailyStats(req, res, next) {
        res.send('GetDailyStats');
    }

    UpdateDailyStats(req, res, next) {
        res.send('UpdateDailyStats');
    }

    UpdateCalculatedStats(req, res, next) {
        res.send('UpdateCalculatedStats');
    }

}

module.exports = StatsService;
