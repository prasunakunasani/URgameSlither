var mongoose = require('mongoose');

//player schema
var playersSchema = new mongoose.Schema({
    cookie_id:
        {
            type: String,
            required: [true, 'No cookie ID']
        },
    google_token:
        {
            type: String,
            required: true
        },
    snake_color:
        {
            type: String,
            required: true
        },
    snake_name:
        {
            type: String,
            required: true
        }
});

// playersSchema.methods.dudify = function () {
//     this.snake_name = this.snake_name + '-dude';
//     return this.name;
// };

//mongoose.model(modelName,schema);
// could've done let Player = module.exports = mongoose.model('Player',playersSchema);
//The modelName becomes the database name (in lowercase with an s added if it's not plural already).
//If you don't want that, force the collection name by including a third parameter
var players = mongoose.model('players', playersSchema, 'players');
module.exports = players;

//FIX - REMOVE AFTER TESTING
// ADDING A SAMPLE RECORD TO SEE HOW IT LOOKS

// How to create a player called chris
var testrecord = new players({
    cookie_id: '12345',
    snake_name: 'iwantoeatyo',
    snake_color: 'black',
    google_token: 'ABCDE'
});

testrecord.save(function (err) {
    if (err) throw err;
    console.log('Player saved successfully!');
});