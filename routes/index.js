var nodemailer = require("nodemailer");
var wechat = require('wechat');
// var API = require('wechat-api');
var redis = require("redis");
var mqtt = require('mqtt');
var mongodb = require('mongodb');
var crypto = require('crypto');
var uuid = require('node-uuid');  

var mongodbServer;
var mongoClient;
var redisClient;
var mqttClient;
var mongo,mongoData;
var mailTransport;

//函数
function md5 (text) {
  return crypto.createHash('md5').update(text).digest('hex');
};

function serverInit()
{
  mongodbServer = new mongodb.Server('localhost', 27017, { auto_reconnect: true, poolSize: 10 });
  mongodbClient = new mongodb.Db('account', mongodbServer);
  mongoDataClient = new mongodb.Db('data', mongodbServer);

  mqttClient = mqtt.connect('mqtt://localhost');  

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
//E51gxulwvNv0WF-g-ouqdZVvdK_gcNED099vdUvkt7aBr-f13kBp6Ew6LV7GJ9IcMF3Ty0wh-wKE_Y1D7pyrsH75IF52gYYoX3nCdZpnMjzVwk2wL32LfMUKtxf-GHuKDANjAHAIFS
exports.wechat = wechat(wxconfig.token, function (req, res, next) {
  // Î¢ÐÅÊäÈëÐÅÏ¢¶¼ÔÚreq.weixinÉÏ
  var message = req.weixin;
  console.log(message);
  if(message.MsgType == 'event')
  {
    if(message.Event == 'subscribe')//订阅事件
    {
      res.reply("Ð»Ð»¹Ø×¢xx");
      console.log("subscribe");
    }else if(message.Event == 'unsubscribe')
    {
      console.log("unsubscribe");
    }
  }else if(message.MsgType == 'text'){
    if(message.Content === '1')
    {
      redisClient.publish("mail", 'new');  
      mqttClient.publish('hello', 'Hello mqtt');
      console.log("mqtt");
      res.reply([
        {
          title: 'ÄãÀ´ÎÒ¼Ò½ÓÎÒ°É',
          description: 'ÕâÊÇÅ®ÉñÓë¸ß¸»Ë§Ö®¼äµÄ¶Ô»°',
          picurl: 'https://www.baidu.com/img/bd_logo1.png',
          url: 'http://www.baidu.com/'
        }
      ]);
    } 
    else if(message.Content === '2')   
    {
      res.reply({
        type: "music",
        content: {
          title: "À´¶ÎÒôÀÖ°É",
          description: "Ò»ÎÞËùÓÐ",
          musicUrl: "http://mp3.com/xx.mp3",
          hqMusicUrl: "http://mp3.com/xx.mp3",
          thumbMediaId: "thisThumbMediaId"
        }
      });
    }
    else if(message.Content === '3') 
    {


    }
   //     res.reply({ type: "text", content: "you input " + message.Content});  
  }
 /* if (message.FromUserName === 'diaosi') {
    // »Ø¸´?Ë¿(ÆÕÍ¨»Ø¸´)
    res.reply('hehe');
  } else if (message.FromUserName === 'text') {
    //ÄãÒ²¿ÉÒÔÕâÑù»Ø¸´textÀàÐÍµÄÐÅÏ¢
    res.reply({
      content: 'text object',
      type: 'text'
    });
  } else if (message.FromUserName === 'hehe') {
    // »Ø¸´Ò»¶ÎÒôÀÖ
    res.reply({
      type: "music",
      content: {
        title: "À´¶ÎÒôÀÖ°É",
        description: "Ò»ÎÞËùÓÐ",
        musicUrl: "http://mp3.com/xx.mp3",
        hqMusicUrl: "http://mp3.com/xx.mp3",
        thumbMediaId: "thisThumbMediaId"
      }
    });
  } else {
    // »Ø¸´¸ß¸»Ë§(Í¼ÎÄ»Ø¸´)
    res.reply([
      {
        title: 'ÄãÀ´ÎÒ¼Ò½ÓÎÒ°É',
        description: 'ÕâÊÇÅ®ÉñÓë¸ß¸»Ë§Ö®¼äµÄ¶Ô»°',
        picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
        url: 'http://nodeapi.cloudfoundry.com/'
      }
    ]);
  }*/
});


