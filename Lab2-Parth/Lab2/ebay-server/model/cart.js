/**
 * Created by Parth on 25-10-2016.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var cartSchema = new Schema(
    {
        user_id:[{ type: Schema.Types.ObjectId, ref: 'User' }],
        product_id:[{ type: Schema.Types.ObjectId, ref: 'Product' }],
        seller_id:[{ type: Schema.Types.ObjectId, ref: 'User' }],
        product_name:{type:String, required:true},
        quantity:{type:Number, required:true},
        price:{type:Number, required:true}
    });

var Cart=mongoose.model('Cart',cartSchema);
module.exports=Cart;