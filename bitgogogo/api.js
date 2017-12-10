
var querystring = require('querystring');
var http = require('http');
var apiconfig = require('../config').bitgogogo.api
const HOST = apiconfig.host
const PORT = apiconfig.port
const URL = "http://" + HOST + ":" + PORT

/*
获取钱包地址
PARAMS:
  name: btc/eth/tch/rbtc/ltc/bcc...
RETURN
  address
*/
exports.getNewAddress = (name) => {
  return new Promise( (reject, resolve)=>{
    http.get( URL +'/v1/getnewaddress?name='+name, function (response) {
      if(response.statusCode !== 200)
        return reject(response.statusMessage)
      var data = null
      response.on('data', function (chunk) {
        data = JSON.parse(chunk)
        if(!data) return reject("null response!")
        if( data && data.err != 0 ) return reject(data.msg)
        resolve(data.msg)
      });
      response.on('end', () => {
        if(data===null) return reject('No data in response.')
      })
    });
  })
}


// this.getNewAddress("rbtc")
// .then(ret=>console.log(ret))
// .catch(err=>console.log(err))



/*
发起提现交易
PARAMS:
  name: btc/eth/tch/rbtc/ltc/bcc...
  to: 目标地址
  amount: 数量
RETURN
  txid: 交易单号
EXAMPLE
*/
// this.sendTransaction("rbtc","fdsafdsafdsa",10)
// .then(ret=>console.log(ret))
// .catch(err=>console.log(err))
exports.sendTransaction = (name, to, amount) => {
  return new Promise( (reject, resolve)=>{
    var postData = querystring.stringify({
      'name':name,
      'to':to,
      'amount':amount,
    });
    var options = {
      hostname: HOST,
      port: PORT,
      path: '/v1/sendtransaction',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    var req = http.request(options, (res) => {
      if(response.statusCode !== 200)
        return reject(response.statusMessage)
      res.setEncoding('utf8')
      var data = null
      res.on('data', (chunk) => {
        data = JSON.parse(chunk)
        if(!data) return reject("null response!")
        if( data && data.err != 0 ) return reject(data.msg)
        resolve(data.msg)
      });
      res.on('end', () => {
        if(data===null) return reject('No data in response.')
      })
    });
    req.on('error', (e) => {
      reject(e.message)
    });
    req.write(postData);
    req.end();
  })
}
