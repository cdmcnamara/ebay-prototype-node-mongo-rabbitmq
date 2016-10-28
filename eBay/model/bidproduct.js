/**
 * Created by Parth on 25-10-2016.
 */
var mongoose=require('mongoose');
mongoose.createConnection('mongodb://localhost:27017/ebay');
var Schema=mongoose.Schema;

var bidProductSchema = new Schema(
    {
        product_id:[{ type: Schema.Types.ObjectId, ref: 'Product' }],
        bidStartTime:{type:String, required:true},
        bidEndTime:{type:String, required:true},
        highestBid:{type:Number, required:true},
        isBidEnded:{type:Boolean, required:true}
    });

var BidProduct=mongoose.model('BidProduct',bidProductSchema);
module.exports=BidProduct;