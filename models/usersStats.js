var mongoose = require('mongoose');

var usersStatsSchema = new mongoose.Schema({
    best_snake:
        {
            _id:
                {
                    type: mongoose.Schema.Types.ObjectId
                },
            boosts:
                {
                    type: Number
                },
            createOn:
                {
                    type: Date
                },
            duration:
                {
                    type: Number
                },
            interval_data:
                {
                    kills:
                        {
                            type: [Number]
                        },
                    length:
                        {
                            type: [Number]
                        }
                },
            kills:
                {
                    type: Number
                },
            length:
                {
                    type: Number
                },
            user_id:
                {
                    type: String
                }
        },
    cookie_id:
        {
            type: String,
            required: [true, 'No cookie ID']
        },
    cumulative_moving_average_snake_length:
        {
            type: [Number]
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
    lastModifiedOn:
        {
            type: Date
        },

    records:
        {
            highest_kills:
                {
                    type: Number
                },
            largest_snake_killed_length:
                {
                    type: Number
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
                }

        }

});

var usersStats = mongoose.model('usersStats', usersStatsSchema, 'users.stats');
module.exports = usersStats;