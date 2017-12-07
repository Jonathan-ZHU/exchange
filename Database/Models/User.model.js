/*
用户信息
*/
const mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  mobile:           {type:String, required:true, unique:true},
  wechat:           {type:String, required:false, default:null },
  pass:             {type:String, required:true},
  recommender:      {type:String, required:false, default:null},

  tch_balance:      {type:Number, required:false, default:0},
  tch_address:      {type:String, required:false},

  utc_balance:      {type:Number, required:false, default:0},
  utc_address:      {type:String, required:false},

  btc_balance:      {type:Number, required:false, default:0},
  btc_address:      {type:String, required:false},

  ltc_balance:      {type:Number, required:false, default:0},
  ltc_address:      {type:String, required:false},

  bcc_balance:      {type:Number, required:false, default:0},
  bcc_address:      {type:String, required:false},

  etc_balance:      {type:Number, required:false, default:0},
  etc_address:      {type:String, required:false},

  eth_balance:      {type:Number, required:false, default:0},
  eth_address:      {type:String, required:false},
});

module.exports = mongoose.model("User", UserSchema);
