/**
 * Created by Parth on 25-10-2016.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var orderSchema = new Schema(
    {
        user_id:[{ type: Schema.Types.ObjectId, ref: 'User' }],
        total:{type:Number, required:true},
        order_date:{type:String, required:true}
    });

var Order=mongoose.model('Order',orderSchema);
module.exports=Order;