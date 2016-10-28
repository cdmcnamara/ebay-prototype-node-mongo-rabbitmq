/**
 * Created by Parth on 29-09-2016.
 */
var ejs= require('ejs');
var mysql_handler = require('../routes/mysql-handler');
var bcrypt=require('bcrypt-nodejs');
var logger=require('../routes/usertracking');
var User =require('../model/users');
var Product =require('../model/product');

var lastloggin;
exports.signIn=function(request,response)
{
    //var user= new User();
    var username= request.param("username");
    var password= request.param("password");
    User.find({ username: request.param("username") }, function(err, user)
    {
        if (err) {
            console.log(err.message);
            throw err;
        }
        else
        {
            console.log(password);
            console.log(user[0].password);
            if(bcrypt.compareSync(password, user[0].password))
            {
                request.session.username = username;
                request.session.user_id= user[0]._id;
                request.session.lastloggin=user[0].lastloggin;
                response.render("product");
                //console.log("Y")
            }
            else
            {
                logger.info("failed signin attempt for user :"+username);
                response.render("index",{title:"Invalid username/password"});
            }
        }
    });

}

exports.loadProducts=function(request,response)
{
    if(request.session.user_id)
    {
        console.log(request.session.user_id);
        var user_id = request.session.user_id;
        var username = request.session.username;
        var lastloggin = request.session.lastloggin;
        Product.find({seller_id:{$ne:user_id},quantity:{$ne:0}}, function(err, results) {
            if (err)
                throw err;
            else
            {
                console.log(results);
                response.send({"statusCode":200,"products":results});

            }
        });
        /*var query = "select * from products where seller_id<>" + user_id +" and quantity>0 order by product_id desc";
        mysql_handler.execute(function (err, results) {
            if (err) {
                console.log("Error occurred:"+err);
            }
            else
            {
               // response.render('home', {user_id:user_id,user: username, lastloggin: lastloggin, data: results, userdata: "",product:"",message:""});
                logger.info("redirecting user to products page");
                response.send({"statusCode":200,"products":results});
            }
        }, query);*/
    }
    else
    {
        response.send({"statusCode":401});
    }

}
