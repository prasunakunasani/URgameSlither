let express = require('express');
let router = express.Router();
let UserService = require('../services/userService');
let UserSnakeService = require('../services/usersSnakesService');
let StatsService = require('../services/statsService');
let config = require('../config');

var userFunctions = new UserService(express);
var userSnakeFunctions = new UserSnakeService(express);
var globalFunctions = new StatsService(express);

class GameController {

    constructor(express) {
        this.express = express;
    }

    Index(req, res, next) {

        res.render('game/index');
    }

    saveUserAndSnake(req, res, next) {
        if(req.body.secret !== config.get("DATA_SECRET"))

        console.log(JSON.stringify(req.body));
        userSnakeFunctions.InsertUsersSnakeData(req.body.usersSnake, next);
        userFunctions.InsertUserDetails(req.body.user, next);
        userFunctions.UpdateUsersStats(req.body.usersSnake,next);
        globalFunctions.UpdateDailyStats(req.body.usersSnake, req.body.currentPlayerCount,next);
        globalFunctions.UpdateCalculatedStats(req.body.usersSnake,next);

        //create a record for dailyStats if doesn't exist, else update - //fixme - wouldn't this be too much checking? Is that okay?
        //use player count coming in form Game Server
        //create a record for calculatedStats if doesn't exist, else update //fixme - again, maybe this can just be created and updated only...? Am I thinking too much?
    }
}

var gameController = new GameController(express);

router.get('/', gameController.Index.bind(gameController));
router.post('/saveUserAndSnake', gameController.saveUserAndSnake.bind(gameController));

module.exports = router;