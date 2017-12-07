const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/exchange", {useMongoClient:true});

/*******************************************************************************

用户模块 User

********************************************************************************/
const User = require("./Models/User.model");

/*
增加用户 （顺便能增加Tcash）
PARAMS
  data
    {
      mobile:
      wechat:
      pass:
      recommender:
    }
RETURN
  ()
*/
exports.addUser = (data) => {
  return new Promise ( (resolve, reject) => {
    var newuser = new User();
    newuser.mobile = data.mobile;
    newuser.wechat = data.wechat;
    newuser.pass = data.pass;
    newuser.recommender = data.recommender;
    newuser.save((err,ret)=>{
      if(err) return reject(err);
      resolve();
    })
  });
}

/*
增加用户的Tcash
PRARMS
  mobile
  amount
RETURN
  修改成功
    { _id: 5a28b3586bc3613848a2f7b4,
      pass: 'fdsafdsa',
      mobile: '15061519078',
      __v: 0,
      eth_balance: 0,
      etc_balance: 0,
      bcc_balance: 0,
      ltc_balance: 0,
      btc_balance: 0,
      utc_balance: 0,
      tch_balance: 20,
    wechat: 'fdsaf' }
  没有该数据：
    null
*/
exports.addTcash = (mobile, amount) =>{
  return new Promise ( (resolve, reject) => {
    var data = {
      $inc:{ tch_balance:amount }
    }
    User.findOneAndUpdate({mobile:mobile}, data, (err,ret)=>{
      if(err) return reject(err);
      resolve(ret);
    })
  });
}

/*
通过手机查询用户
{ _id: 5a28b3586bc3613848a2f7b4,
  pass: 'fdsafdsa',
  mobile: '15061519078',
  __v: 0,
  eth_balance: 0,
  etc_balance: 0,
  bcc_balance: 0,
  ltc_balance: 0,
  btc_balance: 0,
  utc_balance: 0,
  tch_balance: 30,
  wechat: 'fdsaf' }
*/
exports.findUserByMobileAndPass = (mobile,pass) =>{
  return new Promise ( (resolve, reject) => {
    User.findOne({
      mobile:mobile,
      pass:pass
    }, (err,ret)=>{
      if(err) return reject(err);
      resolve(ret);
    })
  });
}


const Code = require("./Models/Code.model");
/*
增加验证码
*/
exports.addCode = (mobile,code) =>{
  return new Promise ( (resolve, reject) => {
    var cd = new Code();
    cd.mobile = mobile;
    cd.code = code;
    cd.save((err,ret)=>{
      if(err) return reject(err);
      resolve(ret);
    })
  });
}

/*
查询验证码 null:不存在
*/
exports.checkCode = (mobile,code) =>{
  return new Promise ( (resolve, reject) => {
    Code.findOne({mobile:mobile,code,code}, (err,ret)=>{
      if(err) return reject(err);
      resolve(ret);
    })
  });
}



// this.addUser({
//   mobile: "15061519079",
//   wechat: "fdsaf",
//   pass: "fdsafdsa",
//   tch_balance: "fdsa" ,
// })
// .then( ()=>console.log("good"))
// .catch( err=>{console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa\n"+err)} )
// //
// this.addTcash("15061519078",10)
// .then( (ret)=>console.log(ret))
// .catch( err=>{console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa\n"+err)} )

// this.checkCode("15061519078","890322")
// .then( (ret)=>console.log(ret))
// .catch( err=>{console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa\n"+err)} )



// /*
// 更新某币种的已记录高度
// */
// exports.updateCheckedHeight = (name, height) => {
//   return new Promise ( (resolve, reject) => {
//     var data = {
//       $set:{
//         lastCheckedHeight:height
//       }
//     }
//     Currency.findOneAndUpdate({name:name}, data, (err,ret)=>{
//       if(err) return reject(err);
//       resolve();
//     })
//   });
// }
//
// /*
// 查询某币种已记录高度
// */
// exports.getCheckedHeight = (name) => {
//   return new Promise ( (resolve, reject) => {
//     Currency.findOne({name:name}, (err,ret)=>{
//       if(err) return reject(err);
//       resolve(ret.lastCheckedHeight);
//     })
//   });
// }
//
// /*
// 查询某币信息
// */
// exports.checkCurrencyByName = (name) => {
//   return new Promise ( (resolve, reject) => {
//     Currency.findOne({name:name}, (err,ret)=>{
//       if(err) return reject(err);
//       resolve(ret);
//     })
//   });
// }
//
// /*
// 创建新币 如果创建过了不要返回错误
// */
// exports.createNewCurrency = (name, height) => {
//   return new Promise ( (resolve, reject) => {
//     this.checkCurrencyByName(name)
//     .then(ret=>{
//       if(ret) {
//         log.info(name + " has been created! nothing done.")
//         resolve()
//         return;
//       }
//       //创建新币种
//       var newcurr = new Currency();
//       newcurr.name = name;
//       newcurr.lastCheckedHeight = height;
//       newcurr.save((err,ret)=>{
//         if(err) return reject(err);
//         resolve();
//       })
//     })
//     .catch(err=>{reject(err)})
//   });
// }
//
// /*
// 初始化某币种的数据库
// */
// exports.initCurrencyDB = ( name ,callback) => {
//   //判断是否已经创建该币种
//   var promiseFindOutIfExisted = new Promise((resolve, reject) => {
//     Currency.findOne({name:name}).exec((err,ret) => {
//       if(err || ret) return reject(err);
//       resolve();
//     });
//   })
//   //未创建则重新创建
//   .then( () => {
//     var newCurr = new Currency();
//     newCurr.name = name;
//     newCurr.save( (err,ret) => {
//       callback(err, ret);
//     });
//   })
//   .catch ( (reason)=>{
//       callback(reason, reason);
//   })
// }
//
// /*
// 删除某币的数据库
// */
// exports.delCurrency = (name) => {
//   return new Promise( (resolve, reject) => {
//     var conditions = {name:name}
//     Currency.remove(conditions, (err) => {
//       if(err) return reject(err)
//       resolve("deleted!")
//     })
//   })
// }
//
// /*******************************************************************************
//
// 以太坊系列账户相关 ETH | ETC  ETHAccounts ETCAccounts
//
// 以太坊系列的货币账户地址都用独立的collection保存
//
// ********************************************************************************/
// const ETHAccounts = require("./Models/ETHAccounts.model");
// const ETCAccounts = require("./Models/ETCAccounts.model");
// /*
// 增加以太坊账户
// name,address=>null
// "eth","0xlldlsafdhjsaa"=>null
// */
// exports.addAccountOfEthereumSeries = (name, address) => {
//   return new Promise ( (resolve, reject) => {
//     var Nmodel = null
//     switch (name) {
//       case "eth": {Nmodel=ETHAccounts;break;}
//       case "etc": {Nmodel=ETCAccounts;break;}
//       default: return reject("invalid currency name!")
//     }
//     var newAccount = new Nmodel();
//     newAccount.address = address;
//     newAccount.save( (err,ret) => {
//       if(err) return reject(err)
//       resolve()
//     });
//   });
// }
//
// /*
// 查询某地址是否已经记录
// name(币种名称)，address=>
// null | {...}
// */
// exports.checkHasAddress = (name, address) => {
//   return new Promise ( (resolve, reject) => {
//     var Nmodel = null
//     switch (name) {
//       case "eth": {Nmodel = ETHAccounts;break;}
//       case "etc": {Nmodel = ETCAccounts;break;}
//       default: return reject("invalid currency name!")
//     }
//     Nmodel.findOne({address:address}).exec((err,ret) => {
//       if(err) return reject(err);
//       resolve(ret);
//     });
//   });
// }
//
// /*
// 清空ETC的accounts数据表，该方法目前仅可应用于测试环境
// */
// exports.clearETCAccounts = () => {
//   return new Promise( (resolve, reject) => {
//     var conditions = {}
//     ETCAccounts.remove(conditions, (err) => {
//       if(err) return reject(err)
//       resolve("deleted!")
//     })
//   })
// }
