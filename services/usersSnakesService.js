let express = require('express');
let UsersSnakes = require('../models/userssnakes');

class UsersSnakesService {

    constructor(express) {
        this.express = express;
    }

    InsertUsersSnakeData(snakeDetails, next) {

         var saveSnakeDetails = new UsersSnakes(snakeDetails);

        saveSnakeDetails.save(function (err) {
            if (err) return next(err);
        });
    }

}

module.exports = UsersSnakesService;
