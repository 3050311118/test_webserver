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
    console.log(JSON.parse(body));
    tokenValue=JSON.parse(body);
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
        console.log("send");
      });  
}
//微信推送
function WeixinPush(pushType,openID,content,name){
      if(pushType === 'custom'){
          var customPush={
            "touser": openID, 
            "msgtype": "text", 
            "text": {
                "content": content
            }
          };
          weixinRequest('custom',customPush);
      }else if(pushType === 'template'){
           var templatePush={ 
            "touser":openID, 
            "template_id":"Xfgsxqiosil5ddu5b6DaoDZirZr4bOXJC0tgceo8LFM", 
            "url":"www.baidu.com", 
            "topcolor":"#FF0000", 
            "data":{ 
                    "keyword1":{ 
                        "value":name, 
                        "color":"#173177" 
                    }, 
                    "keyword2":{ 
                        "value":content, 
                        "color":"#173177" 
                    }
            } 
         };
         weixinRequest('template',templatePush); 
      }    
}
//初始化
function serverInit()
{
   tokenValue.access_token='_sgT_yIVBwM_7wcrfdcFGuKJPo2cJqIg2BjOGK04da5cH4p6br13j4V1FaoCl9iak7pMRqd5UUBzzN_Q2-eYlikw-b7IYfrypTCDf-0VKnDwy5dEyHj1gPWfCa3RI-EaWAVfACAOSN';
 // getAccessToken();
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
      mqttClient.subscribe('alarm')
  });
  mqttClient.on('close',function(packet){
      console.log("mqttjs disconnected");   
  });  
  mqttClient.on('message', function (topic, message) {
     var msg=message.toString();
     console.log("mqtt msg:"+msg);
     try{
       var msgJson=JSON.parse(msg);
       WeixinPush('template',msgJson.openID,msgJson.content,msgJson.name);//
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
  
  if(message.MsgType == 'event')
  {
    if(message.Event == 'subscribe'){//订阅事件
      
      res.reply("欢迎订阅小聪科技");
    }else if(message.Event == 'unsubscribe'){
      
    }else if(message.Event == 'scancode_waitmsg'){
      res.reply("请输入并发送标签上的验证码");
    }
  }else if(message.MsgType == 'text'){
    var content=message.Content;
    if (content.substring(0,3)==="aaa"){
      res.reply("aaaa");
    }else if (content.substring(0,3)==="bbb"){
      res.reply("bbbb");
    }
    
    if(message.Content === '1'){
      mqttClient.publish('WIFI2716979/SUB',"AAA");
    }else if(message.Content === '2'){
      res.reply("custom");
      WeixinPush('custom',fromUser,'AAA',fromUser)
    }else if(message.Content === '3'){
      res.reply("template");
      WeixinPush('template',fromUser,'AAA',fromUser)
    }
  }
});


