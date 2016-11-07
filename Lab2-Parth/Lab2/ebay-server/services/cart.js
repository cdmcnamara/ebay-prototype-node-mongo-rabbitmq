/**
 * Created by Parth on 27-10-2016.
 */
var Cart=require('../model/cart');

function addToCart_request(msg, callback)
{
    var res = {};
    console.log("In add to cart request:"+ msg.user_id);
    var newCartItem=new Cart();
    newCartItem.user_id = msg.user_id;
    newCartItem.product_id = msg.product_id;
    newCartItem.product_name = msg.product_name;
    newCartItem.quantity = msg.quantity;
    newCartItem.price = msg.price;
    newCartItem.seller_id = msg.seller_id;
    newCartItem.save(function (err,result)
    {
        if(err)
        {
            callback(err,res);
        }
        else
        {
            res.code=200;
            res.results=result;
            callback(null,res);
        }
    });
}

function loadCart_request(msg,callback)
{
    var res = {};
    console.log("In load cart request:"+ msg.user_id);
    Cart.find({user_id:msg.user_id}).populate('seller_id').exec(function (err,results)
    {
        if (err)
            callback(err,res);
        else
        {
            console.log(results);
            res.cartData=results;
            callback(null,res);
        }
    });
}

function updateCart_request(msg,callback)
{
    var res = {};
    console.log("In update cart request");
    Cart.findById(msg.cart_id, function(err, cart) {
        if (err)
            callback(err,res);
        else
        {
            console.log(cart);
            cart.quantity=msg.quantity;
            cart.save(function (err)
            {
                if(err)
                {
                    callback(err,res);
                }
                else
                {
                    res.code=200;
                    callback(null,res);
                }
            });


        }
    });
}

function removeFromCart_request(msg,callback)
{
    var res = {};
    console.log("In remove item from cart request");
    Cart.findById(msg.cart_id , function(err, cart_item) {
        if (err)
            callback(err,res);
        else {
            cart_item.remove(function (err)
            {
                if (err)
                    callback(err,res);
                else
                {
                    res.code=200;
                    callback(null,res);
                }

            });
        }
    });
}
exports.addToCart_request=addToCart_request;
exports.loadCart_request=loadCart_request;
exports.updateCart_reques=updateCart_request;
exports.removeFromCart_request=removeFromCart_request;