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

var tokenValue={};
var mongodbServer;
var mongoClient;
var redisClient;
var mqttClient;
var mongo,mongoData;
var mailTransport;

function getAccessToken() {
  var queryParams = {
    'grant_type': 'client_credential',
    'appid': config.appid,
    'secret': config.appsecret
  };
  var wxGetAccessTokenBaseUrl = 'https://api.weixin.qq.com/cgi-bin/token?'+qs.stringify(queryParams);
  var options = {
    method: 'GET',
    url: wxGetAccessTokenBaseUrl
  };
  request(options, function (err, res, body) {
    console.log(JSON.parse(body));
    tokenValue=body;
  });
};

function weixinRequest(urltype,content){
      var url='';
      if(urltype===1){
        url='/cgi-bin/message/custom/send?access_token='+tokenValue.access_token;
      }else if(urltype==2){
        url='/cgi-bin/message/custom/send?access_token='+tokenValue.access_token;
      }
      var strbody=JSON.stringify(content);  
      var options = {
        host: 'api.weixin.qq.com',
        port: 443,
        path: url, 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': strbody.length
        }
      };
      console.log(strbody);
      var post_req = https.request(options, function(res){        
          res.on('data', function(buffer){
             console.log(buffer.toString());
          });
      });   
      post_req.write(strbody);
      post_req.end();
}

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
  redisClient = redis.createClient();
  redisClient.on("error", function (err) {
    console.log("Error " + err);
  });

  mailTransport = nodemailer.createTransport("SMTP", {
      host: "smtp.qq.com",
      secureConnection: true, // use SSL
      port: 465, // port for secure SMTP
      auth: {
          user: "xxxx",
          pass: "xxxxx"
      }
  });

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
      weixinRequest(1,ack);
    }else if(message.Content === '3'){
    }
  }
});


