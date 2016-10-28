/**
 * Created by Parth on 03-10-2016.
 */
var ejs= require('ejs');
var mysql_handler = require('../routes/mysql-handler');
var logger=require('../routes/usertracking');
var Product=require('../model/product');

exports.productDetails=function (request,response)
{
    if(request.session.username) {
        var product_id = request.param("productID");
        var username = request.session.username;
        var lastloggin = request.session.lastloggin;
        var user_id = request.session.user_id;
        Product.find({_id:product_id}).populate('seller_id').exec(function (err,results)
        {
            if (err)
                throw err;
            else
            {
                console.log(results[0].seller_id);
                response.render('productDetail', {productDetail: results});

            }
        });
    }
    else
    {
        response.render('index',{title:"Sign in to continue"});
    }
}