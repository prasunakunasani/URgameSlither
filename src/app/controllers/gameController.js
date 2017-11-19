let express = require('express');
let router = express.Router();
let Users = require('../models/users');
let UserService = require('../services/userService');
let StatsSingleton = require('../services/statsSingleton');
let config = require('../../../config');



//StatsSingleton(express).getInstance();

class GameController {

	constructor(express) {
		this.express = express;
        this.globalFunctions = new StatsSingleton(express);
	}

	Index(req, res, next) {

		Users.findOne({'cookie_id': req.cookies.cookie_id}, function (err, user) {
			if (err) {
				return next(err);
			}
			res.render('game/index',{user: user?user:new Users()});
		});
	}

    //todo - change the service functions to static
    //todo - in UML , if underlined, static

    //takes too long to calculate all of them.

    SaveUserAndSnake(req, res, next) {
        if (req.body.secret !== config.get("DATA_SECRET"))
            return next();

        UserService.InsertUsersSnake(req.body.usersSnake, next);
        UserService.UpdateUsers(req.body.user, next);
        UserService.UpdateUsersStats(req.body.usersSnake, next);
        this.globalFunctions.UpdateDailyStats(req.body.usersSnake, req.body.currentPlayerCount, next);
        this.globalFunctions.UpdateCalculatedStats(req.body.usersSnake, next);

    }
}

var gameController = new GameController(express);

router.get('/', gameController.Index.bind(gameController));
router.get('/testing', gameController.Index.bind(gameController)); //fixme - what's this for? Ask Chris
router.post('/saveUserAndSnake', gameController.SaveUserAndSnake.bind(gameController));

module.exports = router;