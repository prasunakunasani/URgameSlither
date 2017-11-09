let express = require('express');
let router = express.Router();
let UserService = require('../services/userService');
let UserSnakeService = require('../services/usersSnakesService');
let Users = require('../models/users');

var userFunctions = new UserService(express);
var userSnakeFunctions = new UserSnakeService(express);

var newUserCreated = false;

//todo - 2) Do the appropriate calculations based on GameServer data and save them to database
//todo - 2) In diagram, Chris wrote: Index(), SaveUserAndSnake(u: Users, s: UsersSnake, currentPlayerCount: int)
//todo - 3) Somehow, once this controller is update, the other Services need to update date based on each dead snake

class GameController {

    constructor(express) {
        this.express = express;
    }

    Index(req, res, next) {

        res.render('game/index');
    }

    saveUserAndSnake(req, res, next) {

        userSnakeFunctions.InsertUsersSnakeData(req.body.deadSnake, next);
        userFunctions.InsertUserDetails(req.body.newUser, next);
        userFunctions.UpdateUsersStats(req.body.deadSnake,next);


        //create a record for dailyStats if doesn't exist, else update - //fixme - wouldn't this be too much checking? Is that okay?
        //use player count coming in form Game Server
        //create a record for calculatedStats if doesn't exist, else update //fixme - again, maybe this can just be created and updated only...? Am I thinking too much?
    }
}


var gameController = new GameController(express);

router.get('/', gameController.Index.bind(gameController));
router.post('/saveUserAndSnake', gameController.saveUserAndSnake.bind(gameController));

module.exports = router;