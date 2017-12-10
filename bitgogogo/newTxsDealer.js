/*
处理新增交易的接口
直接require该文件就可以启动
需要安装zmq模块
brew install zmq

*/

var zmq = require('zmq')
  , sock = zmq.socket('pull');
var zmqurl = require('../config').bitgogogo.zmq

sock.connect(zmqurl);
console.log('Subscriber connected to port 1999');

sock.on('message', function(message) {
  message = JSON.parse(message.toString())
  console.log(message)
  /*
    message正常格式为
   {
    "name":"rbtc",
    "category":"receive",
    "address":"mxrxypc2q5kev8Bri3t9bzka8TXUXLCv9v",
    "amount":0.06,
    "confirmations":3,
    "txid":"a556228d70ba4e1b0feafbd640c63ec161afa3a8e333e552a1798f950c2e7c0d"
  }
  然后在这里写逻辑
  */
});

// sock.disconnect('tcp://127.0.0.1:1999')
