/**
 * Created by Parth on 30-09-2016.
 */
var ejs= require('ejs');
//var mysql_handler = require('../routes/mysql-handler');
var User =require('../model/users');
var moment= require('moment');
var bcrypt= require('bcrypt-nodejs');
var mq_client = require('../rpc/client');

exports.checkUserName=function(request,response)
{
    var username= request.param("username");
    User.find({username:username},function (err,user)
    {
        if(err)
            console.log(err);
        else
        {
            if(user[0])
            {
                response.send({'statusCode' : 401});
            }
            else
            {
                response.send({'statusCode' : 200});
            }
        }
    });
    /*var query= "select 1 as result from users where username='"+username+"'";
    mysql_handler.execute(function (err,results)
    {
        if(err)
        {
            console.log("Error occurred:"+err);
        }
        else
        {
            console.log(results);
            if(results[0])
            {
                response.send({'statusCode' : 401});

            }
            else
            {
                response.send({'statusCode' : 200});
            }
        }
    },query);*/
}

exports.checkEmail=function(request,response)
{
    var email= request.param("email");
    User.find({email:email},function (err,user)
    {
        if(err)
            console.log(err);
        else
        {
            if(user[0])
            {
                response.send({'statusCode' : 401});
            }
            else
            {
                response.send({'statusCode' : 200});
            }
        }
    });
    /*var query= "select 1 as result from users where email='"+email+"'";
    mysql_handler.execute(function (err,results)
    {
        if(err)
        {
            console.log("Error occurred:"+err);
        }
        else
        {
            console.log(results);
            if(results[0])
            {
                response.send({'statusCode' : 401});

            }
            else
            {
                response.send({'statusCode' : 200});
            }
        }
    },query);*/
}


exports.registerUser=function(request,response)
{
    var form1=JSON.parse(request.param("formdata"));
    var msg_payload =
    {
        "username": request.param("username"),
        "firstname":form1.firstName,
        "lastname":form1.lastName,
        "password": bcrypt.hashSync(form1.password),
        "contactNo":request.param("contactNo"),
        "address":request.param("address"),
        "birthdate":request.param("birthdate"),
        "email":form1.email,
        "lastloggin":moment().format('YYYY-MM-DD H:mm:ss')
    };
    mq_client.make_request('register_queue',msg_payload, function(err,results)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            if(results.code=200)
            {
                console.log("Account created");
                console.log(results);
                response.render('index', { title: "Account succesfully created, please sign in to continue" });
            }
        }
    });

}

exports.signOut=function(request,response)
{
    var msg_payload ={"user_id":request.session.user_id,"lastloggin":moment().format('YYYY-MM-DD H:mm:ss')};

    mq_client.make_request('signout_queue',msg_payload, function(err,results)
    {
        if(err)
        {
            console.log(err);
            throw err;
        }
        else
        {
            console.log('User successfully updated!');
            request.session.destroy();
            response.render('index', {title: "Successfully signed out"});
        }
    });

}

