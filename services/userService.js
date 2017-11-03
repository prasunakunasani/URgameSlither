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

    InsertUserDetails(userDetails, next) {

        console.log('The InsertUserDetails function of userservice. ');
        Users.update({cookie_id: userDetails.cookie_id},
            {
                cookie_id: userDetails.cookie_id,
                google: {
                    profile_id: userDetails.google.profile_id,
                    token: userDetails.token,
                },
                snake:
                    {
                        name: userDetails.name,
                        color: userDetails.color
                    }
            },
            {upsert: true}, function (err, result) {

                console.log("Result of updating is: ");
                console.log(result); //If ok:0, n:0, the nothing got inserted. If nModified:0, nothing got modified.
                if (err)
                    return next(err);
                else if (result.ok == '0')
                    return next(result);
            });
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