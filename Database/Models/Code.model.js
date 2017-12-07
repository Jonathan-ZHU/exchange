/*
code信息
*/
const mongoose = require("mongoose");

var CodeSchema = new mongoose.Schema({
  mobile:           {type:String, required:true},
  code:             {type:String, required:true},
});

module.exports = mongoose.model("Code", CodeSchema);
