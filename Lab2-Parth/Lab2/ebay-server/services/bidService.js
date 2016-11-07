/**
 * Created by Parth on 28-10-2016.
 */
var BidProduct= require('../model/bidproduct');
var BidDetail=require('../model/biddetail');
var Product=require('../model/product');
var Order=require('../model/order');
var OrderDetail = require('../model/orderdetail');
var moment=require('moment');

function bidForProduct_request(msg,callback)
{
    console.log("BidForProduct Request");
    var res={};
    BidProduct.findOne({product_id:msg.product_id},function (err,bidproduct)
    {
        if(err)
        {
            callback(err,res);
        }
        else
        {
            console.log(bidproduct);
            var newBidDetail= new BidDetail();
            newBidDetail.bid_id=bidproduct._id;
            newBidDetail.bid_amount=msg.bid_amount;
            newBidDetail.bidder_id=msg.bidder_id;
            newBidDetail.bid_time=msg.bid_time;
            newBidDetail.save(function (err,result)
            {
                if(err)
                {
                    callback(err,res);
                }
                else
                {
                    //logger.info(request.session.user_id+ ":"+request.session.name+" bidded "+bidAmount+" for product="+product_id);
                    updatePrice(msg.bid_amount,msg.product_id,callback);
                }
            })
        }
    });
}

function updatePrice(bid_amount,product_id,callback)
{
    var res={};
    Product.findById(product_id,function (err,product)
    {
        if(err)
        {
            callback(err,res);
        }
        else
        {
            product.price=bid_amount;
            product.save(function (err,result)
            {
                if(err)
                {
                    callback(err,res);
                }
                else
                {
                    //logger.info("Current price for product="+product_id+" changed to "+bidAmount);
                    console.log("Price Updated");
                    res.code=200;
                    callback(null,res);
                }
            });
        }
    });

}

function biddingProcess_request(msg,callback)
{
    var res={};
    BidProduct.find({isBidEnded:false},function (err,results)
    {
        //console.log(products);
        if(err)
        {
            console.log(err);
            callback(err,res);
        }
        else
        {
            console.log("Bids under process:"+results);
            if(results[0])
            {
                //console.log("HHIHIH");
                for(var i=0;i<results.length;i++)
                {
                    if((Date.now()/1000)>results[i].bidEndTime)
                    {
                        console.log("Bid ended for Product:"+results[i].product_id);
                        closeBid(results[i]._id,results[i].product_id,callback);
                    }
                    else
                    {
                        console.log("Bid still under progress for: "+results[i].product_id);
                        res.code=202;
                        callback(null,res);
                    }
                }
            }
            else
            {
                console.log("No bids under progress");
                res.code=201;
                callback(null,res);
            }
        }
    });
}

function closeBid(bid_id,product_id,callback)
{
    var res={};
    BidProduct.findById(bid_id, function (err, product) {
        if (err)
        {
            console.log(err);
            callback(err,res);
        }
        else
        {
            console.log("BidProduct:" + product);
            product.isBidEnded = true;
            product.save(function (err, result) {
                if (err)
                {
                    console.log(err);
                    callback(err,res);
                }
                else
                {
                    //logger.info(request.session.user_id + ":Bid ended for " + bid_id);
                    console.log("isBidEnded updated:" + result);
                    addOrderToAccount(bid_id,product_id,callback);
                }
            });
        }
    });
}


function addOrderToAccount(bid_id,product_id,callback)
{
    var res={};
    BidDetail.findOne({bid_id: bid_id}).sort('-bid_amount').exec(function (err, detail) {
        if (err)
        {
            console.log(err);
            callback(err,res);
        }
        console.log(detail);
        if (detail)
        {
            var date = moment().format('YYYY-MM-DD');
            var newOrder = new Order();
            newOrder.user_id = detail.bidder_id;
            newOrder.total = detail.bid_amount;
            newOrder.order_date = date;
            newOrder.save(function (err, result) {
                if (err)
                {
                    console.log(err);
                    callback(err,res);
                }
                else
                {
                    addOrderDetails(result._id, product_id,callback);
                }
            });
        }
    });
}


function addOrderDetails(order_id,product_id,callback) {
    console.log("Add order details");
    console.log("Order id:" + order_id);
    console.log("Product id:" + product_id);
    BidProduct.find({product_id: product_id}).populate("product_id").exec(function (err, results) {
        if (err) {
            console.log(err);
            callback(err,null);
        }
        else {
            console.log(results);
            console.log(results[0].product_id);
            var newOrderDetail = new OrderDetail();
            newOrderDetail.order_id = order_id;
            newOrderDetail.product_id = product_id;
            newOrderDetail.price = results[0].product_id[0].price;
            newOrderDetail.product_name = results[0].product_id[0].product_name;
            newOrderDetail.quantity = 1;
            newOrderDetail.save(function (err, result) {
                if (err)
                {
                    console.log(err);
                    callback(err, null);
                }
                else {
                    updateQuantity(product_id,callback);
                }
            })
        }
    });
}

function updateQuantity(product_id,callback)
{
    var res={};
    Product.findById(product_id, function (err, product) {
        if (err) {
            console.log(err);
            callback(err,res);
        }
        else
            {
            product.quantity = 0;
            product.save(function (err, result) {
                if (err)
                {
                    console.log(err);
                    callback(err,res);
                }
                else {
                    //logger.info(request.session.user_id+ ":Updating seller quantities for product"+product_id);
                    console.log("quantity updated");
                    res.code=200;
                    res.product_id=product_id;
                    callback(null,res);
                }
            });
        }
    });
}


exports.biddingProcess_request=biddingProcess_request;
exports.bidForProduct_request=bidForProduct_request;