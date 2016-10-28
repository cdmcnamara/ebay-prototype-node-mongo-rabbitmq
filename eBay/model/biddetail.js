/**
 * Created by Parth on 25-10-2016.
 */
var mongoose=require('mongoose');
mongoose.createConnection('mongodb://localhost:27017/ebay');
var Schema=mongoose.Schema;

var bidDetailSchema = new Schema(
    {
        bid_id:[{ type: Schema.Types.ObjectId, ref: 'BidProduct' }],
        bidder_id:[{ type: Schema.Types.ObjectId, ref: 'User' }],
        bid_time:{type:String, required:true},
        bid_amount:{type:Number, required:true}
    });

var BidDetail=mongoose.model('BidDetail',bidDetailSchema);
module.exports=BidDetail;