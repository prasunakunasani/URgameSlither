let express = require('express');
let CalculatedStats = require('../models/calculatedstats');
let Users = require('../models/users');
let DailyStats = require('../models/dailyStats');
let instance = null;
let uniqueUsers = 0;

Users.count({'updatedAt': {$lt: new Date().toISOString()}}, function (err, count) {
	uniqueUsers = count;
});

class StatsService {

	constructor(express) {

		this.express = express;

        if (!instance) {
            instance = this;
        }

        DailyStats.findOne({'createdOn': {$lte: new Date().toISOString()}}, function (err, result) {
            this.cachedDailyStats = result;
        }.bind(this));

        CalculatedStats.findOne({}, function (err, result) {

            if (!result) {
                result = new CalculatedStats();
                result.totals.all_time.boosts = 0;
                result.totals.all_time.deaths = 0;
                result.totals.all_time.duration = 0;
                result.totals.all_time.kills = 0;
                result.totals.all_time.length =0;
                result.totals.all_time.uniques = 0;
            }

            result.save(function(err){
                if(err) console.error(err);
            })

            this.cachedCalculatedStats = result;
        }.bind(this));


        return instance;
    }

	UpdateDailyStats(snakeDetails, playerCount, next) {

		//var statsCache = new CachedVariables(express,0,calculatedstats);
        //todo - check if good data - check if day flipped over.
        //todo - check to make sure that all data coming from mongoose callback is not null

		DailyStats.update({'createdOn': {$lt: new Date().toISOString()}}, {}, {
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
                if (playerCount > this.cachedDailyStats.peak.concurrent) {
                    tempRecord.peak.concurrent = playerCount;
                    tempRecord.peak = new Date();
                }

                //calculate the totals
                tempRecord.totals.boosts = this.cachedDailyStats.totals.boosts + snakeDetails.boosts;
                tempRecord.totals.deaths = this.cachedDailyStats.totals.deaths + 1;
                tempRecord.totals.duration = this.cachedDailyStats.totals.duration + snakeDetails.duration;
                tempRecord.totals.kills = this.cachedDailyStats.totals.kills + snakeDetails.kills;
                tempRecord.totals.length = this.cachedDailyStats.totals.length + snakeDetails.length;
                tempRecord.totals.unique_users = this.cachedDailyStats.totals.unique_users + uniqueUsers;

                if ((this.cachedDailyStats.totals.unique_users === null) || (this.cachedDailyStats.totals.unique_users < uniqueUsers)) {
                    tempRecord.totals.unique_users = uniqueUsers;
                }

				DailyStats.findOneAndUpdate({'createdOn': {$lt: new Date().toISOString()}}, tempRecord, function (err, result) {
					if (err) return next(err);
					else if (result.ok == '0') return next(JSON.stringify(result));

				});

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
                            length: 0,
                            unique_users: 0
                        }
                }
        };

        tempRecord.totals.all_time.boosts = this.cachedCalculatedStats.totals.all_time.boosts + snakeDetails.boosts;
        tempRecord.totals.all_time.deaths = this.cachedCalculatedStats.totals.all_time.deaths + 1;
        tempRecord.totals.all_time.duration = this.cachedCalculatedStats.totals.all_time.duration + snakeDetails.duration;
        tempRecord.totals.all_time.kills = this.cachedCalculatedStats.totals.all_time.kills + snakeDetails.kills;
        tempRecord.totals.all_time.length = this.cachedCalculatedStats.totals.all_time.length + snakeDetails.length

        let express = require('express');
        let CalculatedStats = require('../models/calculatedstats');
        let Users = require('../models/users');
        let DailyStats = require('../models/dailyStats');
        let instance = null;
        let uniqueUsers = 0;

        Users.count({'updatedAt': {$lt: new Date().toISOString()}}, function (err, count) {
            uniqueUsers = count;
        });

        class StatsService {

            constructor(express) {

                this.express = express;

                if (!instance) {
                    instance = this;
                }

                DailyStats.findOne({'createdOn': {$lte: new Date().toISOString()}}, function (err, result) {
                    this.cachedDailyStats = result;
                }.bind(this));

                CalculatedStats.findOne({}, function (err, result) {

                    if (!result) {
                        result = new CalculatedStats();
                        result.totals.all_time.boosts = 0;
                        result.totals.all_time.deaths = 0;
                        result.totals.all_time.duration = 0;
                        result.totals.all_time.kills = 0;
                        result.totals.all_time.length =0;
                        result.totals.all_time.uniques = 0;
                    }

                    result.save(function(err){
                        if(err) console.error(err);
                    })

                    this.cachedCalculatedStats = result;
                }.bind(this));


                return instance;
            }

            UpdateDailyStats(snakeDetails, playerCount, next) {

                //var statsCache = new CachedVariables(express,0,calculatedstats);
                //todo - check if good data - check if day flipped over.
                //todo - check to make sure that all data coming from mongoose callback is not null

                DailyStats.update({'createdOn': {$lt: new Date().toISOString()}}, {}, {
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
                    if (playerCount > this.cachedDailyStats.peak.concurrent) {
                        tempRecord.peak.concurrent = playerCount;
                        tempRecord.peak = new Date();
                    }

                    //calculate the totals
                    tempRecord.totals.boosts = this.cachedDailyStats.totals.boosts + snakeDetails.boosts;
                    tempRecord.totals.deaths = this.cachedDailyStats.totals.deaths + 1;
                    tempRecord.totals.duration = this.cachedDailyStats.totals.duration + snakeDetails.duration;
                    tempRecord.totals.kills = this.cachedDailyStats.totals.kills + snakeDetails.kills;
                    tempRecord.totals.length = this.cachedDailyStats.totals.length + snakeDetails.length;
                    tempRecord.totals.unique_users = this.cachedDailyStats.totals.unique_users + uniqueUsers;

                    if ((this.cachedDailyStats.totals.unique_users === null) || (this.cachedDailyStats.totals.unique_users < uniqueUsers)) {
                        tempRecord.totals.unique_users = uniqueUsers;
                    }

                    DailyStats.findOneAndUpdate({}, tempRecord, function (err, result) {
                        if (err) return next(err);
                        else if (result.ok == '0') return next(JSON.stringify(result));

                    });

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
                                    length: 0,
                                    unique_users: 0
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
                    else if (result.ok == '0') return next(JSON.stringify(result));

                });
            }

        }

        module.exports = StatsService;

    }

}

module.exports = StatsService;
