let express = require('express');
let instance = null;

class cachedStatsSingleton {

    constructor(express, dailyValues, calculatedValues) {

        this.express = express;

        this.cachedCalculatedStats = {
            totals:
                {
                    all_time:
                        {
                            boosts: calculatedValues.totals.all_time.boosts,
                            deaths: calculatedValues.totals.all_time.deaths,
                            duration: calculatedValues.totals.all_time.duration,
                            kills: calculatedValues.totals.all_time.kills,
                            length: calculatedValues.totals.all_time.length,
                            uniques: calculatedValues.totals.all_time.uniques
                        }
                }
        };

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

        if (!instance)
        {
            instance = this;
        }

        return instance;
    }
}

module.exports = cachedStatsSingleton;
