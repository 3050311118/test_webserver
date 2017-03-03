var nodemailer = require("nodemailer");
var wechat = require('wechat');
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
    if(message.Content === '1'){
       mqttClient.publish('WIFI2716979/SUB',"AAA");
      var aa=res;
      var reply=function(){
        this.aa.reply("XXXX");
      }
      setTimeout(reply,5000);
    } 
    else if(message.Content === '2'){
    }
    else if(message.Content === '3'){
    }
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


