/**
 * Created by Parth on 29-09-2016.
 */
var ejs= require('ejs');
var mysql_handler = require('../routes/mysql-handler');
var userAdd=require('./Advertisements');
var logger=require('../routes/usertracking');
var biddingLogger= require('../routes/biddingTracking');
var Product =require('../model/product');
var BidProduct =require('../model/bidproduct');

exports.addAdvertise=function(request,response)
{
    var newProduct= new Product();
    newProduct.seller_id= request.session.user_id;
    newProduct.product_name= request.param("productName");
    newProduct.description= request.param("description");
    newProduct.price= request.param("price");
    var bidding =request.param("bidding");
    if(bidding=="on")
    {
        newProduct.isBidProduct=true;
    }
    else
        newProduct.isBidProduct=false;

    console.log("bidding:"+bidding);
    newProduct.quantity=request.param("quantity");
    newProduct.save(function(err) {
    if (err)
        throw err;
    else
    {
        console.log(newProduct._id);
        if(bidding)
        {
            var newBidProduct= new BidProduct();
            newBidProduct.product_id=newProduct._id;
            newBidProduct.bidStartTime=Date.now()/1000;
            newBidProduct.bidEndTime=(Date.now()/1000+(4*60));
            newBidProduct.isBidEnded=false;
            newBidProduct.highestBid=request.param("price");
            newBidProduct.save(function (err)
            {
                if(err)
                {
                    console.log(err);
                    throw  err;
                }
                else
                {
                    response.render('advertisements');
                }
            })
        }
        else
        {
            response.render('advertisements');
        }

    }
});
    /*var query= "insert into products(product_name,seller_id,description,quantity,price,isBidProduct) values('"
        +productName+"',"+user_id+",'"+description+"',"+quantity+","+price+","+bidding+")";
    mysql_handler.execute(function (err,results)
    {
        if(err)
        {
            console.log("Error occurred:"+err);
        }
        else
        {
            logger.info(request.session.user_id+ ":added new advertise for selling");
            logger.info(request.session.user_id+":productname="+productName+" ,Quantity="+quantity+", Price="+price);
            console.log("Inserted product");
            console.log(results);
            if(bidding)
            {
                biddingLogger.info("User_id:"+request.session.user_id+"|| added new product for bidding");
                biddingLogger.info(request.session.user_id+":productname="+productName+" ,Quantity="+quantity+", Price="+price);
                console.log("Current timestamp:"+ Date.now()/1000);
                console.log("After 4 days : "+(Date.now()/1000+(96*60*60)));
                var query2="insert into bidproduct(product_id,bidStartTime,bidEndTime,highestBid,isBidEnded) values("+results.insertId

                    + ","+(Date.now()/1000)+","+(Date.now()/1000+(96*60*60))+","+price+",0)";
                mysql_handler.execute(function (err, results) {
                    if (err)
                    {
                        console.log("Error occurred:"+err);
                    }
                    else
                    {

                        console.log(results);
                    }
                }, query2);
            }
            //render back to your advertisements later
            response.render('advertisements');
        }
    },query);*/
}