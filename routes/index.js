var nodemailer = require("nodemailer");
var wechat = require('wechat');
var redis = require("redis");
var mqtt = require('mqtt');
var mongodb = require('mongodb');
var crypto = require('crypto');
var uuid = require('node-uuid');  
var https = require('https');
var getToken=require('../common')
//getToken();

var mongodbServer;
var mongoClient;
var redisClient;
var mqttClient;
var mongo,mongoData;
var mailTransport;

function weixinRequest(urltype,content){
      var url='';
      if(urltype===1){
        url='/cgi-bin/message/custom/send?access_token='+'NOz0ZN6ZAkVAlhcM_w95Fi_Ag1hqgiXfF6g4F8ADroAfnZAg_rDSGEP7tB0iSE4kY_Bu1RaY0Z-RpTnN9-4QPTHI-vFgT3nHJlMCM8gZoQbfuKL6SxaceY6IfZWPn8axFOQiAEAAJL';
      }else if(urltype==2){
        url='/cgi-bin/message/custom/send?access_token='+'NOz0ZN6ZAkVAlhcM_w95Fi_Ag1hqgiXfF6g4F8ADroAfnZAg_rDSGEP7tB0iSE4kY_Bu1RaY0Z-RpTnN9-4QPTHI-vFgT3nHJlMCM8gZoQbfuKL6SxaceY6IfZWPn8axFOQiAEAAJL';
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

var items=[{title:"消息"},{title:"消息"}];
var wxconfig = {
  token: 'weixin',
  appid: 'wx49504f1f16265350',
  appsecret :'47023108954c24e755331a5da6605490', 
  encodingAESKey: 'PYBQANe5rzyxNF4QDqGpI3hoaE6G7TkaQPM3WIpihBr'
};
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


