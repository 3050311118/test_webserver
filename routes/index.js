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
//       var options = {
//         host: 'api.weixin.qq.com',
//         port: 443,
//         path: url, 
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Content-Length': strbody.length
//         }
//       };
//       console.log(url);
//       console.log(strbody);
//       var post_req = https.request(options, function(res){        
//           res.on('data', function(buffer){
//              console.log(buffer.toString());
//           });
//       });   
//       post_req.write(strbody);
//       post_req.end();
}
//初始化
function serverInit()
{
  setInterval(getAccessToken, 20000);
  mongodbServer = new mongodb.Server('localhost', 27017, { auto_reconnect: true, poolSize: 10 });
  mongodbClient = new mongodb.Db('account', mongodbServer);
  mongoDataClient = new mongodb.Db('data', mongodbServer);

  mqttClient = mqtt.connect('mqtt://localhost');  
  mqttClient.on('connect', function () {
      console.log("mqttjs connected");
  })
  mqttClient.on('disconnect',function(packet){
      console.log("mqttjs disconnected"); 
  });  
  
  redisClient = redis.createClient();
  redisClient.on("error", function (err) {
    console.log("Error " + err);
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
      var ack={
        "touser": "oHOgqwvXok5LsBNOOpV6jSZzX6Js", 
        "msgtype": "text", 
        "text": {
            "content": "xxxx"
        }
      };
      weixinRequest('custom',ack);
    }else if(message.Content === '3'){
      var ack={ 
          "touser":"oHOgqwvXok5LsBNOOpV6jSZzX6Js", 
          "template_id":"_uLRsfIvaGOSae_mYY2mKD9Na6YMqwvCCDxOxA0_Lf0", 
          "url":"www.baidu.com", 
          "topcolor":"#FF0000", 
          "data":{ 
                  "first": { 
                      "value":"aaaaaaaa", 
                      "color":"#173177" 
                  }, 
                  "keyword1":{ 
                      "value":"bbbbbbbbb", 
                      "color":"#173177" 
                  }, 
                  "keyword2":{ 
                      "value":"ccccccc", 
                      "color":"#173177" 
                  }, 
                  "keyword3":{ 
                      "value":"ddddd", 
                      "color":"#173177" 
                  }, 
                  "keyword4":{ 
                      "value":"eeeee", 
                      "color":"#173177" 
                  }, 
                  "remark":{ 
                      "value":"fffff", 
                      "color":"#173177" 
                  } 
          } 
       };
       weixinRequest('template',ack);      
    }
  }
});


