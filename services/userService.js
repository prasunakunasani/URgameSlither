let express = require('express');

let Users = require('../models/users');

class UserService {

    constructor(express) {
        this.express = express;
        this.foo = 10;
    }

    GetUserDetails(req, res, next) {
        res.send('GetUserDetails function');
    }

    InsertUserDetails(userDetails, next) {
//fixme - could also do it as - If record doesn't exist, save. Else, call update function without upsert.
        console.log('The InsertUserDetails function of userservice. ');
        console.log(userDetails);
        Users.update({cookie_id: userDetails.cookie_id}, userDetails, {upsert: true}, function (err, result) {
            console.log("Result of updating user record is: ");
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