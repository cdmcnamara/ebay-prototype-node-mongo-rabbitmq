/**
 * Created by Parth on 03-10-2016.
 */
var ejs= require('ejs');
//var mysql_handler = require('mysql-handler');
var logger=require('../routes/usertracking');
var Product=require('../model/product');

exports.userAdvertisements=function(request, response)
{
    if(request.session.username)
    {
        try
        {
        var user_id = request.session.user_id;
        var username = request.session.username;
        var lastloggin = request.session.lastloggin;
        Product.find({seller_id:user_id}, function(err, results) {
            if (err)
                throw err;
            else
            {
                if(results) {
                    console.log(results);
                    logger.info(request.session.user_id + ":loading user advertisement");
                    response.send({"statusCode": 200, "userAds": results});
                }
                else
                {
                    response.send({"statusCode":401});
                }
            }
        });
        }
        catch(err)
        {
            console.log(err)
            response.send({"statusCode":401});
        }
    }
    else
    {
        response.render('index',{title:"Session expired, please sign in to continue"});
    }
}