let express = require('express');
let UsersSnakes = require('../models/usersSnakes');

class UsersSnakesService {

    constructor(express) {
        this.express = express;
        this.foo = 10;
    }


    Insert(req, res, next) {
        res.send('Insert');
    }

}

module.exports = UsersSnakesService;
