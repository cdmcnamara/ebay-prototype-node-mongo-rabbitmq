/**
 * Created by Parth on 25-10-2016.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var productSchema = new Schema(
    {
        product_name:{type:String, required:true},
        seller_id:[{ type: Schema.Types.ObjectId, ref: 'User' }],
        description:{type:String, required:true},
        quantity:{type:Number, required:true},
        price:{type:Number, required:true},
        isBidProduct:{type:Boolean, required:true}
    });

var Product=mongoose.model('Product',productSchema);
module.exports=Product;