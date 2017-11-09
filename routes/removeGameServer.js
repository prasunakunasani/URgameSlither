let express = require('express');
let router = express.Router();

var requestify = require('requestify');

//todo - 2) Assume this is sending a dead snake's details to the Game controller. Implement that eg.
//For this to work, go to http://localhost:3000/sendFakeDeadSnake and just close the page. Cause' you're not sending anything

var newUser = {

    cookie_id: 'coffee',
    google:
        {
            profile_id: null,
            token: null
        },
    snake:
        {
            name: 'bigSnake',
            color: 'Blue'
        }
};

var deadSnake = {

    cookie_id: 'coffee',
    boosts: 20,
    createdOn: new Date(),
    duration: 30,
    interval_data:
        {
            length: [5,10,11,12,20,30],
            kills: [0,1,0,0,2,1]
        },
    kills: 4,
    length: 30
};

router.get('/', function (req, res, next) {
        requestify.post('http://localhost:3000/game/saveUserAndSnake', {newUser: newUser, deadSnake: deadSnake});
        res.send("Post request sent");
});

module.exports = router;