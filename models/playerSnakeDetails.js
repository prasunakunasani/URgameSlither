var mongoose = require('mongoose');

//player schema
var playerSnakeDetailsSchema = new mongoose.Schema({

    cookie_id:
        {
            type: String,
            required: [true, 'No cookie ID']
        },
    boost_count:
        {
            type: Number,
            required: true
        },
    duration:
        {
            type: Number,
            required: true
        },
    interval_data:
        {
            length: {
                type: [Number],
                required: true
            },
            kills: {
                type: [Number],
                required: true
            }
        },
    kill_count:
        {
            type: Number,
            required: true
        },
    length:
        {
            type: Number,
            required: true
        }

});

var playerSnakeDetails = mongoose.model('playerSnakeDetails', playerSnakeDetailsSchema, 'playerSnakeDetails');
module.exports = playerSnakeDetails;
//FIX - REMOVE AFTER TESTING
// ADDING A SAMPLE RECORD TO SEE HOW IT LOOKS

// How to create a player called chris
var testrecord = new playerSnakeDetails({
    cookie_id: '12345',
    boost_count: 20,
    duration: 40,
    interval_data: {
        length: [1, 2, 3, 4],
        kills: [1, 0, 0, 1]
    },
    kill_count: 2,
    length: 10
});

testrecord.save(function (err) {
    if (err) throw err;
    console.log('Player saved successfully!');
});