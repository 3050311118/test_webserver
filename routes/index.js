var nodemailer = require("nodemailer");
var wechat = require('wechat');
var redis = require("redis");
var mqtt = require('mqtt');
var mongodb = require('mongodb');
var crypto = require('crypto');
var uuid = require('node-uuid');  
var https = require('https');
var request = require('request');
var qs = require('querystring');
var fs = require('fs');
var wxconfig = require('../config');

var mongodbServer;
var mongoClient;
var redisClient;
var mqttClient;
var mongo,mongoData;
var mailTransport;
var tokenValue={};
var dict;

//自定义对象  get set
function Dictionary(){
   this.data = new Array();
   this.put = function(key,value){
    this.data[key] = value;
   };
   this.get = function(key){
    return this.data[key];
   };
   this.remove = function(key){
    this.data[key] = null;
   };
   this.isEmpty = function(){
    return this.data.length == 0;
   };
   this.size = function(){
    return this.data.length;
   };
}

//定时获取微信access_token
function getAccessToken() {
  var queryParams = {
    'grant_type': 'client_credential',
    'appid': wxconfig .appid,
    'secret': wxconfig .appsecret
  };
  var options = {
    method: 'GET',
    url: 'https://api.weixin.qq.com'+wxconfig.tokenUrl+qs.stringify(queryParams)
  };
  request(options, function (err, res, body) {
    tokenValue=JSON.parse(body);
    console.log("getAccessToken"+JSON.stringify(tokenValue));
    console.log("tokenValue:"+tokenValue.access_token);
  });
};
//微信客服接口和模板接口
function weixinRequest(urltype,content){
      var url='https://api.weixin.qq.com';
      if(urltype==='custom'){
        url=url+wxconfig.customUrl+tokenValue.access_token;
      }else if(urltype==='template'){
        url=url+wxconfig.templateUrl+tokenValue.access_token;
      }
      var options = {
        url: url,
        method: 'POST',
        body:JSON.stringify(content)
      };  
      request(options, function (err, res, body) {
        console.log("weixinRequest"+JSON.stringify(body))
      });  
}
//微信推送
function WeixinPush(pushType,openid,content,name){
      if(pushType === 'custom'){
          var customPush={
            "touser": openid, 
            "msgtype": "text", 
            "text": {
                "content": content
            }
          };
          weixinRequest('custom',customPush);
      }else if(pushType === 'template'){
          var myDate = new Date();        
          var alarmDate = myDate.getYear()+"年"+myDate.getMonth()+"月"+myDate.getDate()+"日"+myDate.getHours()+"点"+myDate.getMinutes()+"分";
        
           var templatePush={ 
            "touser":openid, 
            "template_id":"Xfgsxqiosil5ddu5b6DaoDZirZr4bOXJC0tgceo8LFM", 
            "url":"panel.mogudz.com/real.html", 
            "topcolor":"#FF0000", 
            "data":{ 
                   "first": {
                       "value": alarmDate,
                       "color":"#173177"
                    },
                    "keyword1":{ 
                        "value":name, 
                        "color":"#173177" 
                    }, 
                    "keyword2":{ 
                        "value":content, 
                        "color":"#173177" 
                    },
                    "remark":{
                       "value":"点击详情查看数据",
                       "color":"#173177"
                   }
            } 
         };
         weixinRequest('template',templatePush); 
      }    
}
//向设备发送绑定请求
function BandAction(openid,check,toDev,content){
  var arr={};
  arr.action="BD";
  arr.openid=openid;
  arr.check=check;
  arr.content=content;
  console.log(JSON.stringify(arr));
  mqttClient.publish(toDev+'/SUB',JSON.stringify(arr));
}

//初始化
function serverInit()
{
//    tokenValue.access_token='_sgT_yIVBwM_7wcrfdcFGuKJPo2cJqIg2BjOGK04da5cH4p6br13j4V1FaoCl9iak7pMRqd5UUBzzN_Q2-eYlikw-b7IYfrypTCDf-0VKnDwy5dEyHj1gPWfCa3RI-EaWAVfACAOSN';
//   dict = new Dictionary();
  getAccessToken();
  setInterval(getAccessToken, 7000000);
  mongodbServer = new mongodb.Server('localhost', 27017, { auto_reconnect: true, poolSize: 10 });
  mongodbClient = new mongodb.Db('account', mongodbServer);
  mongoDataClient = new mongodb.Db('data', mongodbServer);
  
  redisClient = redis.createClient();
  redisClient.on('ready',function(err){
    console.log('redisClient ready');
  });
  redisClient.on("error", function (err) {
    console.log("redisClient Error " + err);
  });

  mqttClient = mqtt.connect('mqtt://localhost');  
  mqttClient.on('connect', function () {
      console.log("mqttjs connected");
      mqttClient.subscribe('alarm');
      mqttClient.subscribe('devack');
  });
  mqttClient.on('close',function(packet){
      console.log("mqttjs disconnected");   
  });  
  mqttClient.on('message', function (topic, message) {
     var msg=message.toString();
     console.log("mqtt msg:"+msg);
     console.log(topic);
     try{
       var msgJson=JSON.parse(msg);
       if(topic === 'alarm')
       {
         WeixinPush('template',msgJson.openid,msgJson.content,msgJson.name);
       }else if(topic === 'devack'){
         WeixinPush('custom',msgJson.openid,msgJson.content,msgJson.name);
       }       
     }catch(e){
       console.log("msg error");
     }
  });        
//发送邮件客户端
  mailTransport = nodemailer.createTransport("SMTP", {
      host: "smtp.qq.com",
      secureConnection: true, // use SSL
      port: 465, // port for secure SMTP
      auth: {
          user: "xxxx",
          pass: "xxxxx"
      }
  });
//mongodb客户端
  mongodbClient.open(function(err, db) {
    if(!err) {
      mongo=db;
    }
  });
  mongoDataClient.open(function(err, db) {
    if(!err) {
      mongoData=db;
    }
  });
}
serverInit();

//微信实现逻辑
exports.wechat = wechat(wxconfig.token, function (req, res, next) {
  var message = req.weixin;
  var fromUser = message.FromUserName;  
  console.log(message);
  if(message.MsgType === 'event')
  {
    if(message.Event === 'subscribe'){//订阅事件
      res.reply("欢迎订阅小聪科技");
    }else if(message.Event === 'unsubscribe'){

    }else if(message.Event === 'scancode_waitmsg'){
       var scanresult=message.ScanCodeInfo.ScanResult;
       if(scanresult.substring(0,2)==="BD"){  
         redisClient.hset(fromUser,"BD_SN",scanresult.substring(2),  function(error){
            res.reply("请输入验证码 加上前缀YZ");
         }); 
       }else{
         res.reply("扫描不匹配");
       }
    }else if(message.Event === 'CLICK'){
      if(message.EventKey === 'QUERY_WEIXINID'){
        res.reply(fromUser);
      }if(message.EventKey === 'QUERY_HARDWARE'){
         res.reply([
           {
             title: '我的在线设备',
             description: '打开链接查看我的在线设备',
             url: 'http://jssdk.mogudz.com/devlist.php?id='+fromUser
           }
         ]);
      }         
    }
  }else if(message.MsgType === 'text'){
    var content=message.Content;
    if (content.substring(0,2)==="BD"){
      redisClient.hset(fromUser, "BD_SN",content.substring(2), redis.print); 
      res.reply('请输入验证码');
    }else if (content.substring(0,2)==="YZ"){
      var check=content.substring(2);      
      redisClient.hget(fromUser,"BD_SN",function(err,response){  
          if(err){  
              console.log("redis err"); 
              res.reply("数据出错");
          }else{  
              console.log(response);  
             if(response === null){
                res.reply("请先扫描或者输入序列号");
             }else{
              res.reply("正在绑定");
              BandAction(fromUser,check,response);
             }
          }  
      });       
    }
     
    if(message.Content === '1'){//调试
      dict.put(fromUser, "China");
      console.log(dict.get(fromUser))
    }else if(message.Content === '2'){
      res.reply("custom");
      WeixinPush('custom',fromUser,'请输入验证码',fromUser)
    }else if(message.Content === '3'){
      res.reply("template");
      WeixinPush('template',fromUser,'AAA',fromUser)
    }
  }
});



