/**
 * Created by Parth on 06-10-2016.
 */
var ejs= require('ejs');
var mysql_handler = require('../routes/mysql-handler');
var logger=require('../routes/usertracking');
var User=require('../model/users');
var mq_client = require('../rpc/client');

exports.profile=function (request,response)
{
    var username=request.param("id");
    if(username==undefined)
    {
        username=request.session.username;
        logger.info(request.session.user_id+ ":Loading user profile");
    }
    else
    {
        logger.info(request.session.user_id+ ":loading profile of user:"+username);
    }
    var msg_payload=
    {
        "username":username
    };

    mq_client.make_request('loadProfile_queue',msg_payload, function(err,results)
    {
        if(!err)
            response.render('profile',{result:results.user});
        else
            throw err;
    });

}

