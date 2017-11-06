var mongoose = require('mongoose');
let UsersSnakes = require('./userssnakes');


var usersStatsSchema = new mongoose.Schema({
    best_snake: UsersSnakes.schema,
    cookie_id:
        {
            type: String,
            required: [true, 'No cookie ID']
        },
    cumulative_moving_average_snake_length: //todo - double check where/if this is being used. (total length/total deaths)
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
    totals:  //averages on stats page are the totoals/#ofgames
        {
            boosts:
                {
                    type: Number
                },
            deaths:  //game played
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