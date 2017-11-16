var mongoose = require('mongoose');

var calculatedStatsSchema = new mongoose.Schema({

    totals:
        {
            all_time:
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
                        }
                }
        }
});

var calculatedStats = mongoose.model('calculatedstats', calculatedStatsSchema);
module.exports = calculatedStats;