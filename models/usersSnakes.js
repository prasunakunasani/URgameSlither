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

var testrecord = new usersSnakes({
    cookie_id : '32342344',
    boosts : 5,
    createdOn : new Date(),
    duration : 56,
    interval_data : {

        length : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
        kills : [2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2]
    },
    kills : 34,
    length : 21

});

testrecord.save(function(err)
{
    if (err) throw err;
    console.log('Player saved successfully!');
});
