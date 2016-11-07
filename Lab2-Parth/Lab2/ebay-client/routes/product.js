/**
 * Created by Parth on 03-10-2016.
 */
var ejs= require('ejs');
var mysql_handler = require('../routes/mysql-handler');
var logger=require('../routes/usertracking');
var Product=require('../model/product');
var mq_client = require('../rpc/client');

exports.productDetails=function (request,response)
{
    if(request.session.username) {
        var product_id = request.param("productID");
        var msg_payload={"product_id":product_id};
        mq_client.make_request('loadProductDetail_queue',msg_payload, function(err,results)
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
                response.render('productDetail', {productDetail: results.results});
            }
        });
    }
    else
    {
        response.render('index',{title:"Sign in to continue"});
    }
}