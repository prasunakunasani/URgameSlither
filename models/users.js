var mongoose = require('mongoose');

var usersSchema = new mongoose.Schema({
    cookie_id:
        {
            type: String
        },
    google:
        {
            profile_id:
                {
                    type: String
                },
            token:
                {
                    type: String
                }
        },
    snake:
        {
            name:
                {
                    type: String
                },
            color:
                {
                    type: String
                }
        }
});

//mongoose.model(modelName,schema);
// could've done let users = module.exports = mongoose.model('Player',usersSchema);
//The modelName becomes the database name (in lowercase with an s added if it's not plural already).
//If you don't want that, force the collection name by including a third parameter
var users = mongoose.model('users', usersSchema);
module.exports = users;
