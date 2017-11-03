let express = require('express');
let router = express.Router();
let UserService = require('../services/userService');

var userFunctions = new UserService(express);

/*todo - 2) Think about all the collections that will either be created or updated once a dead snake comes in.
http://mongoosejs.com/docs/api.html#model_Model.update
todo - Do the appropriate calculations based on GameServer data and save them to database
todo 2) In diagram, Chris wrote: Index(), SaveUserAndSnake(u: Users, s: UsersSnake, currentPlayerCount: int)
*/

class GameController {

    constructor(express) {
        this.express = express;
    }

    Index(req, res, next) {

        console.log('This ran in the gameController');
        console.log(req.body.newUser);
        console.log(req.body.deadSnake);

        //todo - IMPORTANT - Might have to do the below in other update functions and call them here while passing in the data.
        //create a record for a user if they don't already exist - done
        userFunctions.InsertUserDetails(req.body.newUser, next);
            //todo - MAYBE a record can be created when they hit play - their cookie id and snake name and colour gets into the db.
        //create a record for userssnakes
        //create a record for userstats if one dosn't already exist. Else, calculate: check if best snake, if yes, update.
            //calc cumulative_moving_average_snake_length
            //calc interval data averages and sums
            //update lastModifiedOn
            //check if higher than highest kill, check if larger than largest snake killed, if yes, update
            //calc totals and update
        //create a record for dailyStats if doesn't exist, else update - //fixme - wouldn't this be too much checking? Is that okay?
        //create a record for calculatedStats if doesn't exist, else update //fixme - again, maybe this can just be created and updated only...? Am I thinking too much?
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