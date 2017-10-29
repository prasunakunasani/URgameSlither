let express = require('express');

let Users = require('../models/users');
let UsersStats = require('../models/usersStats');
let UsersSnakes = require('../models/usersSnakes');
let DailyStats = require('../models/dailyStats');
let CalculatedStats = require('../models/calculatedStats');
var cookie_id = "rkrDhmZA-";

class UserService {

    constructor(express) {
        this.express = express;
        this.foo = 10;
    }

    Get(req, res, next) {
        return (this.foo);
    }

    Insert(req, res, next) {
        res.send('The insert function of userservice. ');

    }

    Update(req, res, next) {
        res.send('The update function of userservice. ');
    }

    saveUsersSnakeData(req, res, next) {
        res.send('The saveUsersSnakeData function of userservice. ');
    }

}

module.exports = UserService;
