var ejs= require('ejs');
var mysql_handler = require('../routes/mysql-handler');
var moment= require('moment');
var logger=require('../routes/usertracking');
var biddingLogger= require('../routes/biddingTracking');
var Cart= require('../model/cart');
var Order= require('../model/order');
var Product= require('../model/product');
var OrderDetail= require('../model/orderdetail');
var BidDetail=require('../model/biddetail');
var BidProduct=require('../model/bidproduct');
var mq_client = require('../rpc/client');

exports.addOrderEntry=function (request,response)
{
    var msg_payload=
    {
        "user_id":request.session.user_id,
        "total":request.param("total"),
        "order_date":moment().format('YYYY-MM-DD'),
        "cartData":request.param("cartData")
    }
    mq_client.make_request('addOrders_queue',msg_payload, function(err,results)
    {
        if(err)
        {
           console.log(err);
            throw err;
        }
        else
        {
            try {
                if (results.code == 200) {
                    response.send({"statusCode": 200});
                }
                else if (results.code == 399)
                {
                    throw new Error("Failed to empty cart");
                }
                else if (results.code = 401)
                {
                    throw new Error("Order entry failed");
                }
                else if (results.code = 402)
                {
                    throw new Error("Order detail entry failed")
                }
                else if (results.code = 403)
                {
                    throw new Error("seller updation failed");
                }
            }
            catch(err)
            {
                console.log(err);
                response.send({"statusCode":401});
            }

        }
    });

}

exports.loadOrders=function (request,response)
{
    if(request.session.username) {
        var msg_payload = {"user_id": request.session.user_id}
        mq_client.make_request('loadOrders_queue', msg_payload, function (err, results) {
            console.log(results);
            if (!err)
                response.send({"statusCode": 200, "orderDetails": results});
        });
    }
    else
    {
        response.send({"statusCode": 401});
    }


}



exports.addToCart=function(request,response)
{
    var msg_payload=
    {
        "user_id" : request.session.user_id,
        "product_id" : request.param("product_id"),
        "product_name" : request.param("product_name"),
        "quantity" : request.param("quantity"),
        "price" : request.param("price"),
        "seller_id" : request.param("seller_id")
    }
    mq_client.make_request('addToCart_queue',msg_payload, function(err,results)
    {
        if(err)
        {
            console.log(err);
            throw err;
        }
        else
        {
            if(results.code == 200)
            {
                console.log("Result:"+results);
                //logger.info(request.session.user_id + ":" + username + " added " + result.quantity + " " + result.product_name + " into cart");
                response.send({'statusCode': 200});
            }
            else
            {
                response.send({'statusCode' : 401});
            }
        }
    });

}

exports.loadCart=function (request,response)
{
    if(request.session.username)
    {
    var msg_payload={"user_id":request.session.user_id}
    mq_client.make_request('loadCart_queue',msg_payload, function(err,results)
    {
        if(err)
            console.log(err);
        else
        {
            logger.info(request.session.user_id+ ":loading user cart");
            //console.log(results[0].seller_id);
            response.send({'statusCode' : 200,'cartData':results.cartData});

        }
    });
    }
    else
    {
        response.send({'statusCode' : 401});
    }
}

exports.removeFromCart=function(request,response)
{
    var msg_payload=
    {
        "cart_id":request.param("cart_id")
    }
    mq_client.make_request('removeFromCart_queue',msg_payload, function(err,results)
    {
        if(err)
            console.log(err);
        else
        {
            if(results.code=200)
            {
                logger.info(request.session.user_id+ ":"+request.session.username +" removed product with cart id: "+request.param("cart_id"));
                response.send({"statusCode":200});
            }
        }
    });
}

exports.updateCartItem=function(request,response)
{
    var msg_payload=
    {
        "cart_id":request.param("cart_id"),
        "quantity":request.param("quantity")
    }
    mq_client.make_request('updateCart_queue',msg_payload, function(err,results)
    {
        if(err)
            console.log(err);
        else
        {
            if(results.code==200)
            {
                response.send({'statusCode' : 200});
            }
        }
    });
}

exports.bidForProduct=function (request,response)
{
    var msg_payload=
    {
        "bid_amount":request.param("bidAmount"),
        "bidder_id":request.session.user_id,
        "product_id":request.param("product_id"),
        "bid_time":Date.now()/1000
    }
    mq_client.make_request('bidForProduct_queue',msg_payload, function(err,results)
    {
        if(err)
        {
            console.log(err);
            throw err;
        }
        else
        {
            if(results.code=200)
            {
                response.send({"statusCode":200});
            }
        }
    });
}

