let express = require('express');

let Users = require('../models/users');
let UsersStats = require('../models/usersStats');
let UsersSnakes = require('../models/userssnakes');
var cookie_id = "rkrDhmZA-";

class UserService {

    constructor(express) {
        this.express = express;
        this.foo = 10;
    }

    GetUserDetails(req, res, next) {
        res.send('GetUserDetails function');
    }

    InsertUserDetails(req, res, next) {
        res.send('The InsertUserDetails function of userservice. ');

    }

    UpdateUserDetails(req, res, next) {
        res.send('The UpdateUserDetails function of userservice. ');
    }

    UpdateUsersStats(req, res, next) {
        res.send('The UpdateUsersStats function of userservice. ');
    }

}

module.exports = UserService;

//fixme - Make sure the class diagram functions match the code (capitals and stuff)