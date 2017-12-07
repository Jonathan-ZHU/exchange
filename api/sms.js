var http = require('http');
// 修改为您的短信账号
var account="I4101422";
// 修改为您的短信密码
var password="ENdn7balhPb541";
// var msg="test";
// 短请求地址请登录253云通讯自助通平台查看或者询问您的商务负责人获取
var sms_host = 'intapi.253.com';
// 发送短信地址
var send_sms_uri = '/send/json';
// 查询余额地址
var query_balance_uri = '/msg/balance/json';

exports.send = (qu,mobi,code) => {
  return new Promise( (resolve, reject)=>{
    var phone = qu.toString() + mobi.toString()
    var msg="【派德麟】您的验证码是" + code + "。如非本人操作，请忽略";
    function post(uri,content,host){
        var options = {
            hostname: host,
            port: 80,
            path: uri,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            }
        };
        var req = http.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                chunk=JSON.parse(chunk)
                if(chunk.code == 0 ) return resolve()
                return reject(chunk.error)
            });
        });
        console.log(content)
        req.write(content);

        req.end();
    }
    function send_sms(uri,account,password,mobile,msg){

        var post_data = { // 这是需要提交的数据
        'account': account,
        'password': password,
        'mobile':mobile,
        'msg':msg,
        };
        var content =  JSON.stringify(post_data);
        post(uri,content,sms_host);

    }
    send_sms(send_sms_uri,account,password,phone,msg)
  })
}

// this.send("86","15061519070","5555")
// .then(ret=>console.log(ret))
// .catch(err=>console.log(err))
// query_blance(query_balance_uri,account,password);

//
//
// // 查询余额方法
// function query_blance(uri,content,host){
//     var post_data = { // 这是需要提交的数据
//     'account': account,
//     'password': password,
//     };
//     var content = JSON.stringify(post_data);
//     post(uri,content,sms_host);
// }
