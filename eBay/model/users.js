/**
 * Created by Parth on 25-10-2016.
 */
var mongoose=require('mongoose');
mongoose.createConnection('mongodb://localhost:27017/ebay');
var Schema=mongoose.Schema;

var userSchema = new Schema(
{
    username: {type:String, required:true, unique:true},
    firstname: {type:String, required:true},
    lastname: {type:String, required:true},
    password: {type:String ,required:true},
    contactNo: {type:Number, required:true},
    address:{type:String,required:true},
    birthdate:{type:String,required:true},
    email:{type:String,required:true},
    lastloggin:{type:String,required:true}
});

var User=mongoose.model('User',userSchema);
module.exports=User;