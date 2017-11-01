var mongoose = require('mongoose');

var usersSnakesSchema = new mongoose.Schema({
    cookie_id:
        {
            type: String
        },
    boosts:
        {
            type: Number
        },
    createdOn:
        {
            type: Date
        },
    duration:
        {
            type: Number
        },
    interval_data:
        {
            length:
                {
                    type: [Number]
                },
            kills:
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
        }
});

var usersSnakes = mongoose.model('users.snakes', usersSnakesSchema);
module.exports = usersSnakes;