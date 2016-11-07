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
var mq_client = require('../rpc/client');

exports.addAdvertise=function(request,response)
{
    var bidding;
    if(request.param("bidding"))
    {
        bidding=true;
    }
    else
        bidding=false;
    var msg_payload=
    {
        "product_name":request.param("productName"),
        "description":request.param("description"),
        "quantity":request.param("quantity"),
        "price":request.param("price"),
        "seller_id":request.session.user_id,
        "isBidProduct":bidding
    }

    mq_client.make_request('insertProduct_queue',msg_payload, function(err,results)
    {
        if(err)
        {
            console.log(err);
            throw err;
        }
        else
        {
            if(results.code==200)
            {
               console.log(msg_payload);
                if(bidding)
                {
                    var biddingMsg_payload=
                    {
                        "product_id":results.product_id,
                        "bidStartTime":Date.now()/1000,
                        "bidEndTime":(Date.now()/1000+(4*60)),
                        "isBidEnded":false,
                        "highestBid":request.param("price")
                    }
                    addBidProduct(response,biddingMsg_payload);
                }
                else
                {
                    response.render('advertisements');
                }
            }
        }
    });


}

function addBidProduct(response,msg_payload)
{
    mq_client.make_request('insertBidProduct_queue',msg_payload, function(err,results)
    {
        if(err)
        {
            console.log(err);
            throw err;
        }
        else
        {
            if(results.code==200)
            {
                console.log(msg_payload);
                response.render('advertisements');
            }
        }
    });
}