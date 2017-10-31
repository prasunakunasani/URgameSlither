var mongoose = require('mongoose');
let UsersSnakes = require('./userssnakes');


var usersStatsSchema = new mongoose.Schema({
    best_snake: UsersSnakes.schema,
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

var usersStats = mongoose.model('users.stats', usersStatsSchema);
module.exports = usersStats;