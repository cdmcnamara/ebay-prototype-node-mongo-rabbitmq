/**
 * Created by Parth on 27-10-2016.
 */

var User=require('../model/users');

function loadProfile_request(msg, callback){

    var res = {};
    console.log("In load profile request:"+ msg.user_id);

    User.find({ username: msg.username }, function(err, user) {
        if (err) {
            console.log(err.message);
            callback(err,res);
        }
        else
        {

            console.log(user);
            res.user=user;

            callback(null,res);
           // response.render('profile',{result:user});
        }
    });
}

exports.loadProfile_request=loadProfile_request;