/**
 * Created by Parth on 11-10-2016.
 */
var mysql=require('../routes/mysql-handler');
var moment=require('moment');
var logger= require('../routes/biddingTracking');
var BidProduct= require('../model/bidproduct');
var Product= require('../model/product');
var BidDetail= require('../model/biddetail');
var Order= require('../model/order');
var OrderDetail=require('../model/orderdetail');
var mq_client = require('../rpc/client');

setInterval(function (request,response)
{
    var msg_payload={};
    mq_client.make_request('biddingProcess_queue',msg_payload, function(err,results)
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
                console.log("Bidding process ended for :"+results.product_id);
            }
            else if(results.code==201)
            {
                console.log("No bids in process");
            }
            else if(results.code==202)
            {
                console.log("Bid/s under progress")
            }
        }
    });
    /*
    BidProduct.find({isBidEnded:false},function (err,results)
    {
       //console.log(products);
        if(err)
        {
            console.log("Error occurred:"+err);
        }
        else
        {
            if(results)
            {
                for(var i=0;i<results.length;i++)
                {
                    if((Date.now()/1000)>results[i].bidEndTime)
                    {
                        console.log("Bid ended for Product:"+results[i].product_id);
                        closeBid(results[i]._id);
                        addOrderToAccount(results[i]._id,results[i].product_id);
                    }
                    else
                    {
                        console.log("Bid still under progress for: "+results[i].product_id);
                    }
                }
            }
        }
    });
    var query="select * from bidProduct where isBidEnded=0";
    mysql.execute(function (err,results)
    {
        if(err)
        {
            console.log("Error occurred:"+err);
        }
        else
        {
            if(results)
            {
                for(var i=0;i<results.length;i++)
                {
                    if((Date.now()/1000)>results[i].bidEndTime)
                    {
                        console.log("Bid ended for Product:"+results[i].product_id);
                        closeBid(results[i].bid_id);
                        addOrderToAccount(results[i].bid_id,results[i].product_id);

                    }
                    else
                    {
                        console.log("Bid still under progress for: "+results[i].product_id);
                    }
                }
            }
        }
    },query);*/
},5000);

function closeBid(bid_id)
{
    BidProduct.findById(bid_id,function (err,product)
    {
       if(err)
       {
           console.log(err);
       }
       else
       {
           console.log("BidProduct:"+product);
           product.isBidEnded=true;
           product.save(function (err,result)
           {
               if(err)
               {
                   console.log(err);
               }
               else
               {
                   logger.info(request.session.user_id+ ":Bid ended for "+bid_id);
                   console.log("isBidEnded updated:"+result);
               }
           });
       }
    });
    /*var query="update bidProduct set isBidEnded=1 where bid_id="+bid_id;
    mysql.execute(function (err,results)
    {
           if(err)
           {
               console.log("Error occurred:"+err);
           }
           else
           {logger.info(request.session.user_id+ ":Bid ended for "+bid_id);
               console.log("isBidEnded updated");
           }
    },query);*/
}

function updateQuantity(product_id)
{
    Product.findById(product_id,function (err,product)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            product.quantity=0;
            product.save(function (err,result)
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    //logger.info(request.session.user_id+ ":Updating seller quantities for product"+product_id);
                    console.log("quantity updated");
                }
            });
        }
    });
    /*var query="update products set quantity=0 where product_id="+product_id;
    mysql.execute(function (err,results)
    {
        if(err)
        {
            console.log("Error occurred:"+err);
        }
        else
        {
            logger.info(request.session.user_id+ ":Updating seller quantities for product"+product_id);
            console.log("quantity updated");
        }
    },query);*/
}

function addOrderToAccount(bid_id,product_id)
{
    BidDetail.findOne({bid_id:bid_id,}).sort('-bid_amount').exec(function (err,detail)
    {
        if(err) {
            console.log(err);
        }
        console.log(detail);
        if(detail)
        {
            var date = moment().format('YYYY-MM-DD');
            var newOrder=new Order();
            newOrder.user_id=detail.bidder_id;
            newOrder.total=detail.bid_amount;
            newOrder.order_date=date;
            newOrder.save(function (err,result)
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    addOrderDetails(result._id,product_id);
                }
            });
        }
    });
    /*var query="select * from ebaydb.bid_detail where bid_id="+bid_id+" having max(bid_amount)";
    mysql.execute(function (err,results)
    {
        if(err)
        {
            console.log("Error occurred:"+err);
        }
        else
        {
            console.log(results[0]);

            if(results[0])
            {
                var date = moment().format('YYYY-MM-DD');
                var addOrderQuery = "insert into ebaydb.order(user_id,total,order_date) values(" + results[0].bidder_id
                    + "," + results[0].bid_amount + ",'" + date + "');";
                mysql.execute(function (err, results2) {
                    if (err)
                        console.log("Error occurred:"+err);
                    else
                    {
                        if (results2)
                        {
                            addOrderDetails(results2.insertId,product_id);
                        }
                    }
                }, addOrderQuery);
            }
        }
    },query);*/
}

function addOrderDetails(order_id,product_id)
{
    console.log("Add order details");
    console.log("Order id:"+order_id);
    console.log("Product id:"+product_id);
    BidProduct.find({product_id:product_id}).populate("product_id").exec(function (err,results)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(results);
            console.log(results[0].product_id);
            var newOrderDetail= new OrderDetail();
            newOrderDetail.order_id=order_id;
            newOrderDetail.product_id=product_id;
            newOrderDetail.price=results[0].product_id[0].price;
            newOrderDetail.product_name=results[0].product_id[0].product_name;
            newOrderDetail.quantity=1;
            newOrderDetail.save(function (err,result)
            {
                if(err)
                    console.log(err);
                else
                {
                    updateQuantity(product_id);
                }
            })
        }
    });
    /*var query="select b.bid_id,p.product_id,p.product_name,p.price from ebaydb.bidproduct b ,ebaydb.products p where b.product_id="+product_id+" and b.product_id=p.product_id;";
    mysql.execute(function (err,results)
    {
        if(err)
            console.log("Error occurred:"+err);
        else
        {
            var query2="insert into ebaydb.order_detail" +
                "(order_id,product_id,product_name,quantity,price) values(" +
                order_id+ ","+product_id+",'"+results[0].product_name+"',"+1+","+results[0].price+")";
            mysql.execute(function (err,results2)
            {
                if(err)
                    console.log("Error occurred:"+err);
                else
                {
                    updateQuantity(product_id);
                }
            },query2);
        }
    },query);*/
}