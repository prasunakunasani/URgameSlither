var mongoose = require('mongoose');

var dailyStatsSchema = new mongoose.Schema({

    createdOn:
        {
            type: Date
        },
    peak:
        {
            concurrent:
                {
                    type: Number
                },
            time:
                {
                    type: Date
                }
        },
    totals:
        {
            boosts:
                {
                    type: Number
                },
            deaths:
                {
                    type: Number
                },
            duration:
                {
                    type: Number
                },
            kills:
                {
                    type: Number
                },
            length:
                {
                    type: Number
                },
            unique_users:
                {
                    type: Number
                }

        }

});

var dailyStats = mongoose.model('dailystats', dailyStatsSchema);
module.exports = dailyStats;