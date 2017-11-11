var mongoose = require('mongoose');

var dailyStatsSchema = new mongoose.Schema({

    createdOn:
        {
            type: Date,
            default: Date.now()
        },
    interval_data:
        {
            averages:
                {
                    type: [Number]
                },
            sums:
                {
                    type: [Number]
                }
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
                    type: Number,
                    default: 0
                },
            deaths:
                {
                    type: Number,
                    default: 0
                },
            duration:
                {
                    type: Number,
                    default: 0
                },
            kills:
                {
                    type: Number,
                    default: 0
                },
            length:
                {
                    type: Number,
                    default: 0
                },
            unique_users:
                {
                    type: Number,
                    default: 0
                }

        }

});

var dailyStats = mongoose.model('dailystats', dailyStatsSchema);
module.exports = dailyStats;
