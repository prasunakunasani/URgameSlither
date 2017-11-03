let express = require('express');
let CalculatedStats = require('../models/calculatedstats');
let DailyStats = require('../models/calculatedstats');
let instance = null;
let calculatedstats = '';
let dailystats = '';

CalculatedStats.findOne({_id: '59f7963076e17b9677bc56c0'}, function (err, calcstats) {
    calculatedstats = calcstats;
});

DailyStats.findOne({'createdOn': {$lt: new Date().toISOString()}}, function (err, dailyStats) {
    dailystats = dailyStats;
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

        this.cachedDailyStats = {
            createdOn: dailystats.createdOn,
            peak:
                {
                    concurrent: dailystats.peak.concurrent,
                    time: dailystats.peak.time
                },
            totals:
                {
                    boosts: dailystats.totals.boosts,
                    deaths: dailystats.totals.deaths,
                    duration: dailystats.totals.duration,
                    kills: dailystats.totals.kills,
                    length: dailystats.totals.length,
                    unique_users: dailystats.totals.unique_users
                }
        };

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
