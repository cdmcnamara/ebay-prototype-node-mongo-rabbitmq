/**
 * Created by Parth on 27-10-2016.
 */
var Product=require('../model/product');
var BidProduct= require('../model/bidproduct');

var bcrypt=require('bcrypt-nodejs');


function loadProduct_request(msg, callback){

    var res = {};
    console.log("In load product request:"+ msg.user_id);

    Product.find({seller_id:{$ne:msg.user_id},quantity:{$ne:0}}, function(err, results)
    {
        if (err)
        {
            callback(err,res);
        }


        else
        {
            console.log(results);
            res.code=200;
            res.results=results;
            callback(null,res);


        }
    });
}

function loadProductDetail_request(msg, callback){

    var res = {};
    console.log("In load product detail request:"+ msg.user_id);

     Product.find({_id:msg.product_id}).populate('seller_id').exec(function (err,results)
     {
        if (err)
        {
            callback(err,res);
        }
        else
        {
            console.log(results[0].seller_id);
            res.results=results;
            callback(null,res);
        }
     });
}

function insertProduct_request(msg,callback)
{
    console.log("Insert Product Request");
    var res={};
    var newProduct= new Product();
    newProduct.product_name=msg.product_name;
    newProduct.description=msg.description;
    newProduct.price=msg.price;
    newProduct.quantity=msg.quantity;
    newProduct.seller_id=msg.seller_id;
    newProduct.isBidProduct=msg.isBidProduct;
    newProduct.save(function (err,result)
    {
        if(err)
        {
            callback(err,res);
        }
        else
        {
            res.code=200;
            res.product_id=newProduct._id;
            callback(null,res);
        }
    });

}

function insertBidProduct_request(msg,callback)
{
    console.log("Insert Bid Product Request");
    var res={};
    var newBidProduct= new BidProduct();
    newBidProduct.product_id=msg.product_id;
    newBidProduct.bidStartTime=msg.bidStartTime;
    newBidProduct.bidEndTime=msg.bidEndTime;
    newBidProduct.isBidEnded=msg.isBidEnded;
    newBidProduct.highestBid=msg.highestBid;
    newBidProduct.save(function (err,result)
    {
        if(err)
            callback(err,res);
        else
        {
            res.code=200;
            res.product=result
            callback(null,res);
        }
    });
}

exports.insertBidProduct_request=insertBidProduct_request;
exports.insertProduct_request=insertProduct_request;
exports.loadProduct_request=loadProduct_request;
exports.loadProductDetail_request=loadProductDetail_request;
