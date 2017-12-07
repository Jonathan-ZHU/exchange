const express = require("express");
const db = require("../Database/db")
var app = express()

//设置跨与访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use(bodyParser.json())

/*
获取验证码
*/
// app.get('/v1/getcode',function(req,res){
//   if(!req.query.mobile) return res.send({err:-1,msg:"no mobile!"})
//   var name = req.query.mobile
// });

/*
新增用户
POST:
  mobile
  wechat
  pass
  recommender
  code
RES:
CURL:
*/
app.post('/v1/newuser',function(req,res){
  if( !req.body.mobile ) res.send({err:-100,msg:'no mobile!'})
  if( !req.body.pass )   res.send({err:-200,msg:'miss password!'})
  if( !req.body.code )   res.send({err:-300,msg:'miss code!'})
  var data = {}
  data.mobile = req.body.mobile
  data.pass = req.body.pass
  data.code = req.body.code
  data.wechat = req.body.wechat
  data.recommender = req.body.recommender
  //查询code是否正确
  db.checkCode(data.mobile,data.code)
  .then(ret=>{
    if(!ret) return res.send({err:-400,msg:'code not correct!'})
    //新增用户
    return db.addUser(data)
  })
  .then( ()=>{
    return res.send({err:0,msg:'added!'})
  })
  .catch(err=>{
    console.log(err);
    return res.send({err:-1000,msg:err.toString() })
  })
});



/*
  login
POST:
  User
  Pass
*/
app.post('/v1/login',function(req,res){
  if( !req.body.user )   res.send({err:-100,msg:'miss user!'})
  if( !req.body.user )   res.send({err:-200,msg:'miss password!'})
  //查询code是否正确
  db.findUserByMobileAndPass(req.body.user, req.body.user)
  .then(ret=>{
    if(!ret) return res.send({err:-300,msg:'not found!'})
    return res.send({err:0,msg:'correct!'})
  })
  .catch(err=>{
    console.log(err)
    return res.send({ err:-1000,msg:err.toString() })
  })
});




app.listen(8000);
log.info("API V1 listening on " + 8000);

//抛出app实例给测试脚本用
exports.app = app
