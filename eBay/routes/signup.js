/**
 * Created by Parth on 30-09-2016.
 */
var ejs= require('ejs');
//var mysql_handler = require('../routes/mysql-handler');
var User =require('../model/users');
var moment= require('moment');
var bcrypt= require('bcrypt-nodejs');

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
    var newUser=new User();
    var form1=JSON.parse(request.param("formdata"));
    newUser.username=request.param("username");
    newUser.firstname=form1.firstName;
    newUser.lastname=form1.lastName
    newUser.password= bcrypt.hashSync(form1.password);
    newUser.contactNo=request.param("contactNo");
    newUser.address=request.param("address");
    newUser.birthdate=request.param("birthdate");
    newUser.email= form1.email;
    newUser.lastloggin= moment().format('YYYY-MM-DD H:mm:ss');
    newUser.save(function(err) {
        if (err)
            throw err;
        else
            response.render('index', { title: "Account succesfully created, please sign in to continue" });
    });


}

exports.signOut=function(request,response)
{
    User.findById(request.session.user_id, function(err, user) {
        if (err)
            throw err;
        else
        {
            user.lastloggin = moment().format('YYYY-MM-DD H:mm:ss');


            // save the user
            user.save(function (err)
            {
                if (err)
                    throw err;
                else
                {
                    console.log('User successfully updated!');
                    request.session.destroy();
                    response.render('index',{title:"Successfully signed out"});
                }
            });
        }
        });

}

