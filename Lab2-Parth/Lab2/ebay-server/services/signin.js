/**
 * Created by Parth on 27-10-2016.
 */
var User=require('../model/users');
var bcrypt=require('bcrypt-nodejs');

function signin_request(msg, callback){

    var res = {};
    console.log("In signin request:"+ msg.username+","+msg.password);
    User.find({username:msg.username},function (err,user)
    {
        if(err)
        {
            console.log(err);
            callback(err,res);
        }
        else
        {
            if(bcrypt.compareSync(msg.password, user[0].password))
            {
                res.code=200;
                res.username = msg.username;
                res.user_id= user[0]._id;
                res.lastloggin=user[0].lastloggin;
                callback(null,res);
            }
            else
            {
                res.code=401;
                callback(null,res);
            }
        }
    });

}

function signout_request(msg, callback){

    var res = {};
    console.log("In signout request:"+ msg.user_id);
    User.findById(msg.user_id, function(err, user) {
        if (err)
            throw err;
        else
        {
            user.lastloggin = msg.lastloggin;
            user.save(function (err)
            {
                if (err) {
                    throw err;
                    callback(err,res);
                }
                else
                {
                    res.code=200;
                    callback(null,res);
                }
            });
        }
    });
}
exports.signout_request=signout_request;
exports.signin_request = signin_request;