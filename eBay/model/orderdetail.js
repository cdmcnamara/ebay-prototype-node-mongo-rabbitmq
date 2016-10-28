/**
 * Created by Parth on 25-10-2016.
 */
var mongoose=require('mongoose');
mongoose.createConnection('mongodb://localhost:27017/ebay');
var Schema=mongoose.Schema;

var orderDetailSchema = new Schema(
    {
        order_id:[{ type: Schema.Types.ObjectId, ref: 'Order' }],
        product_id:[{ type: Schema.Types.ObjectId, ref: 'Product' }],
        quantity:{type:Number, required:true},
        price:{type:Number, required:true},
        product_name:{type:String, required:true}
    });

var OrderDetail=mongoose.model('OrderDetail',orderDetailSchema);
module.exports=OrderDetail;