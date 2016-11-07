/**
 * Created by Parth on 27-10-2016.
 */
var User=require('../model/users');
var bcrypt=require('bcrypt-nodejs');


function registerUser_request(msg, callback){

    var res = {};
    console.log("In registerUser request:");
    var newUser= new User();
    newUser.username=msg.username;
    newUser.firstname=msg.firstname;
    newUser.lastname=msg.lastname;
    newUser.password= msg.password;
    newUser.contactNo=msg.contactNo;
    newUser.address=msg.address;
    newUser.birthdate=msg.birthdate;
    newUser.email= msg.email;
    newUser.lastloggin= msg.lastloggin;
    newUser.save(function (err,result)
    {
        if(err)
        {
            callback(err,res);
        }
        else
        {
            res.code=200;
            callback(null,res);
        }
    });


}

exports.registerUser_request = registerUser_request;