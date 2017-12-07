var http = require('http');
// 修改为您的短信账号
var account="I4101422";
// 修改为您的短信密码
var password="ENdn7balhPb541";
// 修改为您要发送的短信内容
var msg="【253云通讯】您的验证码是123456。如非本人操作，请忽略。";
// var msg="test";
// 短请求地址请登录253云通讯自助通平台查看或者询问您的商务负责人获取
var sms_host = 'http://intapi.253.com/send/json?';
// 发送短信地址
var send_sms_uri = '/msg/send/json';
// 查询余额地址
var query_balance_uri = '/msg/balance/json';

exports.send = (mobile,code) => {
  return new Promise( (resolve, reject)=>{
    var msg="【派德麟】您的验证码是 " + code + " 。如非本人操作，请忽略。";
    var post = function(uri,content,host){
      var options = {
            hostname: host,
            path: uri,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            }
        };
        var req = http.request(options, function (res) {
            console.log('STATUS: ' + res.statusCode);

            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                resolve(chunk)
            });
        });
        req.write(content);
        req.end();
    }
    var send_sms = function(uri,account,password,phone,msg){
        var post_data = { // 这是需要提交的数据
        'account': account,
        'password': password,
        'phone':phone,
        'msg':msg,
        'report':'false',
        };
        var content =  JSON.stringify(post_data);
        post(uri,content,sms_host);
    }
    send_sms(send_sms_uri,account,password,mobile,msg)
  })
}

this.send("15061519070","111111")
.then(ret=>console.log(ret))
.catch(err=>console.log(err))
// query_blance(query_balance_uri,account,password);



// 查询余额方法
function query_blance(uri,content,host){
    var post_data = { // 这是需要提交的数据
    'account': account,
    'password': password,
    };
    var content = JSON.stringify(post_data);
    post(uri,content,sms_host);
}
