let express = require('express');
let router = express.Router();

//todo - 2) Do the appropriate calculations based on GameServer data and save them to database
//todo - 2) In diagram, Chris wrote: Index(), SaveUserAndSnake(u: Users, s: UsersSnake, currentPlayerCount: int)
//todo - 3) Somehow, once this controller is update, the other Services need to update date based on each dead snake

class GameController {

    constructor(express) {
        this.express = express;
    }

    Index(req, res, next) {
        console.log('This ran in the gameController');
    //   console.log(req.body);
        console.log(req.body.usersdata);
    }

}

var gameController = new GameController(express);

router.post('/', gameController.Index.bind(gameController));

module.exports = router;


/* FOR TEST-POST

var requestify = require('requestify');
let Users = require('../models/users');

router.get('/', function (req, res, next) {

    Users.findOne({'cookie_id': "rkrDhmZA-"}, function (err, users) {

        requestify.post('http://localhost:3000/test', {usersdata: users});
    });

    next();
});
*/

/*
In a different file, :

router.post('/test', function (req,res) {

    console.log(req.body);

});

*/

/*
//todo - ask Chris
The requestify posts the data to the application server and the console.log in the app server gets the data.
What is the currentPlayerCount? what is it used for  in the Game Controller?
 */