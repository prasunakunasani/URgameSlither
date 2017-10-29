let express = require('express');
let calculatedStats = require('../models/calculatedStats');
let dailyStats = require('../models/dailyStats');

class StatsService {

    constructor(express) {
        this.express = express;
        this.foo = 10;
        this.cachedCalculatedStats = {
            totals:
                {
                    all_time:
                        {
                            boosts: calculatedStats.totals.all_time.boosts,
                            deaths: calculatedStats.totals.all_time.deaths,
                            duration: calculatedStats.totals.all_time.duration,
                            kills: calculatedStats.totals.all_time.kills,
                            length: calculatedStats.totals.all_time.length,
                            uniques: calculatedStats.totals.all_time.uniques
                        }
                }
        };

        this.cachedDailyStats = {
            createdOn: dailyStats.createdOn,
            peak:
                {
                    concurrent: dailyStats.peak.concurrent,
                    time: dailyStats.peak.time
                },
            totals:
                {
                    boosts: dailyStats.totals.boosts,
                    deaths: dailyStats.totals.deaths,
                    duration: dailyStats.totals.duration,
                    kills: dailyStats.totals.kills,
                    length: dailyStats.totals.length,
                    unique_users: dailyStats.totals.unique_users
                }
        };

    }

    //fixme - should this be GetUserStats?
    GetProfileStats(req, res, next) {
        res.send('GetProfileStats');
    }

    GetCalculatedStats(req, res, next) {
        res.send('GetCalculatedStats');
    }

    GetDailyStats(req, res, next) {
        res.send('GetDailyStats');
    }

    UpdateUserStats(req, res, next) {
        res.send('UpdateUserStats');
    }

    UpdateDailyStats(req, res, next) {
        res.send('UpdateDailyStats');
    }

    UpdateCalculatedStats(req, res, next) {
        res.send('UpdateCalculatedStats');
    }

}

module.exports = StatsService;
