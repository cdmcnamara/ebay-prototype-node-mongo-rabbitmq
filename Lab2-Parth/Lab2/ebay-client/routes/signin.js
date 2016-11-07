/**
 * Created by Parth on 29-09-2016.
 */
var ejs= require('ejs');
var mysql_handler = require('../routes/mysql-handler');
var bcrypt=require('bcrypt-nodejs');
var logger=require('../routes/usertracking');
var User =require('../model/users');
var Product =require('../model/product');
var mq_client = require('../rpc/client');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');


var lastloggin;
exports.signIn=function(request,response,next)
{
    passport.authenticate('login', function (err, user, info) {
        if (err) {
            console.log(err);
        }
        if (user.code==401)
        {
            console.log("Incorrect username/pass");
           return response.render("index",{title:"Invalid username/password"});
        }
        else if(user.code==200)
        {
            console.log("user=="+user);
            request.session.username = user.username;
            request.session.user_id= user.user_id;
            request.session.lastloggin=user.lastloggin;
            return response.render("product");
        }
    })(request, response,next);


}

exports.loadProducts=function(request,response)
{
    if(request.session.user_id)
    {
        console.log(request.session.user_id);
        var user_id = request.session.user_id;
        var username = request.session.username;
        var lastloggin = request.session.lastloggin;
        var msg_payload={"user_id":user_id};
        mq_client.make_request('loadProduct_queue',msg_payload, function(err,results)
        {
            if(results.code=200)
            {
                response.send({"statusCode":200,"products":results.results});
            }
        });

    }
    else
    {
        response.send({"statusCode":401});
    }

}
