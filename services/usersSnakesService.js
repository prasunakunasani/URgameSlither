let express = require('express');
let UsersSnakes = require('../models/userssnakes');

class UsersSnakesService {

    constructor(express) {
        this.express = express;
        this.foo = 10;
    }

    InsertUsersSnakeData(req, res, next) {
        res.send('Insert');
    }

    InsertUsersStatsData(req, res, next) {
        res.send('Insert');
    }

}

module.exports = UsersSnakesService;
