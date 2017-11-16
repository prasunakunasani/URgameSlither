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
        userSnakeFunctions.InsertUsersSnakeData(req.body.usersSnake, next);
        userFunctions.InsertUserDetails(req.body.user, next);
        userFunctions.UpdateUsersStats(req.body.usersSnake,next);
        globalFunctions.UpdateDailyStats(req.body.usersSnake, req.body.currentPlayerCount,next);
        globalFunctions.UpdateCalculatedStats(req.body.usersSnake,next);
    }
}

var gameController = new GameController(express);

router.get('/', gameController.Index.bind(gameController));
router.get('/testing', gameController.Index.bind(gameController)); //fixme - what's this for? Ask Chris
router.post('/saveUserAndSnake', gameController.saveUserAndSnake.bind(gameController));

module.exports = router;