const express = require("express");
const db = require("../Database/db")
const bodyParser = require('body-parser')
const sms = require('./sms')
var app = express()

//设置跨与访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header("Content-Type", "text/html;charset=utf-8");
    next();
});

app.use(bodyParser.json())

/*
获取验证码
CURL:
curl http://120.92.92.77:8332/v1/getcode \
-H "Content-Type: application/json" \
-X POST -d '{"prefix":"86","mobile":"15061519070"}'

curl http://127.0.0.1:8332/v1/getcode \
-H "Content-Type: application/json" \
-X POST -d '{"prefix":"86","mobile":"15061519070"}'
*/
app.post('/v1/getcode',function(req,res){
  if(!req.body.prefix) return res.send({err:-200,msg:"no prefix!"})
  if(!req.body.mobile) return res.send({err:-100,msg:"no mobile!"})
  //生成6位数
  var num = []
  num[0] = parseInt(Math.random()*10)
  num[1] = parseInt(Math.random()*10)
  num[2] = parseInt(Math.random()*10)
  num[3] = parseInt(Math.random()*10)
  num[4] = parseInt(Math.random()*10)
  num[5] = parseInt(Math.random()*10)
  var code = num.join("")
  //发送短信
  sms.send(req.body.prefix,req.body.mobile,code)
  .then(()=>{
    //记录该数据
    db.addCode(req.body.mobile,code)
  })
  .then((ret)=>{
    return res.send({err:0,msg:code})
  })
  .catch( err=>{
    return res.send({err:-1000,msg:err.toString()})
  })
});

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
curl http://120.92.92.77:8000/v1/newuser \
-H "Content-Type: application/json" \
-X POST -d '{"mobile":"15061519070","wechat":"456789","pass":"123465","code":"111111","recommender":"15061519070"}'
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
  mobile
  Pass
CURL:
  curl http://127.0.0.1:8000/v1/login \
  -H "Content-Type: application/json" \
  -X POST -d '{"mobile":"15061519070","pass":"123465"}'
*/
app.post('/v1/login',function(req,res){
  if( !req.body.mobile )   res.send({err:-100,msg:'miss user!'})
  if( !req.body.pass )   res.send({err:-200,msg:'miss password!'})
  //查询code是否正确
  db.findUserByMobileAndPass(req.body.mobile, req.body.pass)
  .then(ret=>{
    if(!ret) return res.send({err:-300,msg:'not found!'})
    return res.send({err:0,msg:'correct!'})
  })
  .catch(err=>{
    console.log(err)
    return res.send({ err:-1000,msg:err.toString() })
  })
});


app.listen(8332);
console.log("API V1 listening on " + 8332);

//抛出app实例给测试脚本用
exports.app = app
