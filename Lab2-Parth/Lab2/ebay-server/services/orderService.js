/**
 * Created by Parth on 27-10-2016.
 */
var Order=require('../model/order');
var OrderDetail=require('../model/orderdetail');
var Product=require('../model/product');
var Cart=require('../model/cart');


function loadOrders_request(msg,callback)
{
    var res = {};
    console.log("In load orders request:"+ msg.user_id);
    Order.find({user_id:msg.user_id}).sort({order_date: -1}).exec(function (err,order)
    {
        if(err)
        {
            console.log(err);
            callback(err,res);
        }
        else
        {
            loadOrderDetails(order,callback);
        }
    });
}

function loadOrderDetails(orders,callback)
{
    var flag=true;
    var orderList= [];
    var temp=0;
    for(var i=0;i<orders.length;i++)
    {
        var order_id=orders[i]._id;
        var order_date=orders[i].order_date;
        OrderDetail.find({order_id:order_id}).populate("order_id").exec(function (err,result)
        {
            if(err)
            {
                callback(err,null);
            }
            else
            {
                temp++;
                console.log(result);
                if(result)
                {
                    orderList.push(result);
                }
            }
        });
    }
    setTimeout(function ()
    {
        if(temp==orders.length)
        {
            var res={};
            res.order=orderList;
            callback(null,res);
        }
    },300);

}

function addOrder_request(msg,callback)
{
    console.log("In add orders request:"+ msg.user_id);
    var res = {};
    var newOrder= new Order();
    newOrder.user_id=msg.user_id;
    newOrder.total=msg.total;
    newOrder.order_date =msg.order_date;
    newOrder.save(function (err,results)
    {
        if(err)
            callback(err,res);
        else
        {
            if(results)
            {
                addOrderDetails(msg,newOrder._id,callback);
            }
            else
            {
                res.code=401;
                callback(null,res);
            }
        }

    });
}

function addOrderDetails(msg,order_id,callback)
{
    var flag=true;
    var temp=0;
    var res={};
    var cartData=msg.cartData;
    for(var i=0;i<cartData.length;i++)
    {
        var newOrderDetail= new OrderDetail();
        newOrderDetail.order_id=order_id;
        newOrderDetail.product_id=cartData[i].product_id;
        newOrderDetail.product_name=cartData[i].product_name;
        newOrderDetail.quantity=cartData[i].quantity;
        newOrderDetail.price=cartData[i].price;
        newOrderDetail.save(function (err,results)
        {
            if(results)
            {
                temp++;
                console.log(results);
            }
            else
            {
                console.log("failed");
                flag=false;
            }
        });
    }
    setTimeout(function ()
    {
        if (temp == cartData.length) {
            if (flag)
            {
                updateSellers(msg,callback);
            }
            else
            {
                res.code=402;
                callback(null,res);
            }
        }
    },300);
}

function updateSellers(msg,callback)
{
    var res={};
    var cartData=msg.cartData;
    var flag=true;
    var temp=0;
    for(var i=0;i<cartData.length;i++)
    {
        console.log("Productid:"+cartData[i].product_id+", Quantity:"+cartData[i].quantity);
        var quantity=cartData[i].quantity;
        Product.findById(cartData[i].product_id, function(err, product) {
            if (err)
                callback(err,res);
            else
            {
                console.log(product.quantity);
                product.quantity = product.quantity-cartData[temp].quantity;
                product.save(function (err,result)
                {
                    if (err)
                        callback(err,res);
                    else
                    {
                        if(result)
                        {

                            console.log(result);
                        }
                        else
                        {
                            flag=false;
                        }
                    }
                });
                temp++;
            }
        });
    }
    setTimeout(function ()
    {
        if(temp==cartData.length) {
            if (flag)
            {
                emptyCart(msg,callback);
            }
            else
            {
                res.code=403;
                callback(null,res);
            }
        }
    },300);
}

function emptyCart(msg,callback)
{
    var res={};
    var user_id=msg.user_id;
    Cart.find({user_id:user_id}).remove().exec(function (err,result)
    {
        if(err)
        {
            callback(err,res);
        }
        else
        {
            if(result)
            {
                res.code=200;
                callback(null,res);
            }
            else
            {
                res.code=399;
                callback(null,res);
            }
        }
    });

}


exports.addOrder_request=addOrder_request;
exports.loadOrders_request=loadOrders_request;