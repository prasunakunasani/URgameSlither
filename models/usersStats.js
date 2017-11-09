var mongoose = require('mongoose');
let UsersSnakes = require('./userssnakes');


var usersStatsSchema = new mongoose.Schema({
    best_snake: UsersSnakes.schema,
    cookie_id:
        {
            type: String,
            required: [true, 'No cookie ID']
        },
    cumulative_moving_average_snake_length: //todo- (total length/total deaths) per game?
        {
            type: [Number],
            default: [0]
        },
    interval_data:
        {
            averages:
                {
                    type: [Number],
                    default: [0]
                },
            sums:
                {
                    type: [Number],
                    default: [0]
                }

        },
    lastModifiedOn:
        {
            type: Date,
            default: Date.now()
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
                    type: Number,
                    default: 0
                },
            deaths:  //game played
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

});

var usersStats = mongoose.model('users.stats', usersStatsSchema);
module.exports = usersStats;