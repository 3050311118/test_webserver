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

var items=[{title:"ÎÄÕÂ1"},{title:"ÎÄÕÂ2"}];
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
    if(message.Event == 'subscribe')
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


exports.highcharts = function(req, res){
  res.render('highcharts', { title: 'Express' });
};



exports.roomlogin = function(req, res){
  res.render('roomlogin', { title: 'Express' });
};
exports.roomcheck = function(req, res){
  var code=req.body.loginPwd;
  redisClient.hget('roomcode','aaa',function(err,data){
      var result={};
      if(code === data)
      {
         result.success=true;
         result.url="/highcharts.html"
      }else
      {
         result.success=false;
         result.message="code";
      }
      res.json(result)
  })
};
//默认首页
exports.index = function(req, res){
  redisClient.hincrby("pagecount","indexpage",1);
  res.render('index', { title: 'Express' });
};
//登录页面
exports.login = function(req, res){
  redisClient.hincrby("pagecount","loginpage",1);
  res.render('login');
};
//用户注册页面
exports.register= function(req, res){
  redisClient.hincrby("pagecount","registerpage",1);
  res.render('register');
};
//网关登录页面
exports.snlogin = function(req, res){   
  redisClient.hincrby("pagecount","snloginpage",1);        
  res.render('snlogin', { title: 'Express' });
};
//网络配置登录页面
exports.webconfig = function(req, res){   
  redisClient.hincrby("pagecount","webconfigpage",1);         
  res.render('webconfig');
};
//ÓÃ»§¹ÜÀíÒ³
exports.manager = function(req, res){           
  redisClient.incr("managerpage", redis.print);
  res.render('manager',{title:req.session.name});
};
exports.echarts = function(req, res){           
  res.render('echarts');
};
exports.top = function(req, res){           
  res.render('top',{ name: req.session.name});
};
exports.left = function(req, res){           
  res.render('left');
};
exports.main = function(req, res){  
  if(req.session.name === undefined )
  {
    res.redirect('/login.html')
  }     
  res.render('main');
};
exports.devlist = function(req, res){           
  res.render('devlist');
};
exports.messagecenter = function(req, res){           
  res.render('messagecenter');
};
exports.deviceedit = function(req, res){           
  res.render('deviceedit');
};
exports.gatewayedit = function(req, res){           
  res.render('gatewayedit');
};
exports.gatewaylist = function(req, res){           
  res.render('gatewaylist');
};
exports.devicelist = function(req, res){   
  mongo.collection("user_"+req.params.name).find({},{_id:0},function(err,data){
    data.toArray(function(err,arr){
      res.render('devicelist',{ items:arr});
    });
  });
};
exports.devicedata = function(req, res){ 
  var sn=req.params.sn;
  res.render('devicedata',{ sn:sn});
};
exports.querydevdata = function(req, res){ 
  var sn=req.params.sn;
  var from=req.params.from;
  var to=req.params.to;

  mongoData.collection(sn).find({},{_id:0},function(err,data){
    data.toArray(function(err,arr){
       res.json(arr);
    });
  });
};

exports.home = function(req, res){           
  res.render('home');
};

//restful½Ó¿Ú
//Éè±¸ÑéÖ¤²Ù×÷Ò³Ãæ
exports.snconfirm = function(req, res){  
  var sn=req.body.sn+"_check";
  var key=req.body.key;
  console.log(sn);
  console.log(key);
  // console.log(req.url)
  // res.send("ok");
};
exports.checkrandom = function(req, res){  
  var sn=req.params.sn+"_check";
  var key="";
  for(var i=0;i<6;i++)
  {
    key += Math.floor(Math.random()*10);
  }
  redisClient.set(sn, key, function(err, data){
      if(err) {
          console.log(err);
      } else {
          redisClient.expire(sn, 30);
          res.send(key);
      }
  });  
};
exports.logout = function(req, res){           
  req.session.name=null;
  res.redirect('/login.html')
};
exports.checksn = function(req, res){   
//³É¹¦    
  var json1={
    "pass":true,
    "redirectUrl":"snmanager.html"
  }
//Ê§°Ü
// errorMsg: 
// sn   sn²»´æÔÚ
// pwd  ÃÜÂë´íÎó
  var json2={
    "pass":false,
    "errorMsg":"sn"
  }
  res.json(json2);
};

// ²éÑ¯Êý¾Ý
exports.getdatas = function(req, res){
  var json=[
  {"date":"2014-11-00","consume":"100"},
  {"date":"2014-11-01","consume":"101"},
  {"date":"2014-11-02","consume":"102"},
  {"date":"2014-11-03","consume":"103"},
  {"date":"2014-11-04","consume":"104"},
  {"date":"2014-11-05","consume":"105"},
  {"date":"2014-11-06","consume":"106"}];
  res.json(json)
};
//手机信息与服务器同步
exports.syncinfo = function(req, res){
  var name=req.body.name;
  var devlist=req.body.devlist;

  console.log(name)
  console.log(devlist)

  var arr=JSON.parse(devlist);
  var json={};
  mongo.collection("user_"+name, function(err, collection) {  
    if(err)
    {
      json.ack=false;
      json.message="err";
    }else
    {
      for(var i in arr)
      {
        collection.insert(arr[i],function(err,data){});
      }
      json.ack=true;
    }
  });
  res.json(json)
};
//添加设备与服务器同步
exports.adddev = function(req, res){
  var name=req.params.username
  var sn = req.params.sn;

  console.log(name);
  console.log(sn);

  var result={};

  if(name === undefined)
  {
    result.success=false;
    result.message="name";  
    res.json(result)
    return;
  }

  if(sn === undefined)
  {
    result.success=false;
    result.message="sn";  
    res.json(result)
    return;
  }

  mongo.collection("user_"+name, function(err, collection) {  
    if(err)
    {
      result.success=false;
      result.message="dberr";
      res.json(result)  
    }else
    {
      collection.insert({sn:sn,time:Date.parse(new Date())},function(err,data){
        result.success=true;
        res.json(result)
      });
    }
  });
}
//删除设备与服务器同步
exports.deldev = function(req, res){
  //如果是deldev/:id  id不为空则删除单个，为空则清除全部
  var name=req.params.username
  var sn=req.params.sn;

  console.log(name);
  console.log(sn);

  var result={};

  if(name === undefined)
  {
    result.success=false;
    result.message="name";  
    res.json(result)
    return;
  }

  if(sn === undefined)
  {
    var doc={}
  }else{
    var doc={sn:sn}
  }
  
  mongo.collection("user_"+name).remove(doc,function(err,data){
    if(err)
    {
      result.success=false;
      result.message="dberr"
    }else{
      result.success=true;      
    }
    res.json(json);  
  })
}
//验证是否注册成功 邮箱
exports.checksubmit = function(req, res){
   var email = req.params.email;
    redisClient.hgetall(email, function(error, data){
        if(error) {
            console.log(error);
        } else {
          mongo.collection("users").insert(info,function(err,data){
              var info={};
              if(err)
              {

              }else{
                //注册成功 登陆页面
                res.redirect("/");
              }
          }); 
        }
    });
};
//手机端注册
exports.mobileregistersubmit = function(req, res){
  var info={}
  info.name    =req.body.myname;       
  info.password=req.body.password;
  info.email   =req.body.email;
  info.regip   =req.ip;
  info.lastip  =req.ip;
  info.lasttime=info.regtime =Date.parse(new Date()); 
  info.qq      =null;
  info.wechatid=null;
  info.userlevel=0;
  info.longitude=parseFloat(req.body.longitude);
  info.latitude =parseFloat(req.body.latitude);

  var ack={};
  mongo.collection("users").find({name:info.name},function(err,data){
    data.toArray(function(err,arr){
      if(arr.length)
      {
        ack.success=false;
        ack.message="name";
        res.json(ack)
        return;
      }else
      {
          mongo.collection("users").find({email:info.email},function(err,data){
          data.toArray(function(err,arr){
            if(arr.length)
            {
              ack.success=false;
              ack.message="email";
              res.json(ack)
              return;
            }else
            {
              mongo.collection("users").insert(info,function(err,data){
                  var ack={};
                  if(err)
                  {

                  }else{
                    //注册成功 登陆页面
                    ack.success=true;
                    res.json(ack);
                  }
              });  
            }
          })
        })
      }
    })
  }) 
}
//网页端注册提交
//实时验证邮箱
exports.checkemail = function(req, res){
  var email=req.body.email;
  mongo.collection("users").find({email:email},function(err,data){
    data.toArray(function(err,arr){
      if(arr.length)
      {
        res.send("false");
      }else{
        res.send("true");
      }
    })
  })
};
//实时验证名字
exports.checkname = function(req, res){
  var name=req.body.myname;
  mongo.collection("users").find({name:name},function(err,data){
    data.toArray(function(err,arr){
      if(arr.length)
      {
        res.send("false");
      }else{
        res.send("true");
      }
    })
  })
};
//注册提交
exports.registersubmit = function(req, res){
  var info={}
  info.name    =req.body.myname;       
  info.password=req.body.password;
  info.email   =req.body.email;
  info.regip   =req.ip;
  info.lastip  =req.ip;
  info.lasttime=info.regtime =Date.parse(new Date()); 
  info.qq      =null;
  info.wechatid=null;
  info.userlevel=0;
  info.longitude=req.body.longitude;
  info.latitude =req.body.latitude;

  mongo.collection("users").insert(info,function(err,data){
      var ack={};
      if(err)
      {

      }else{
        //注册成功 登陆页面
        ack.success=true;
        res.json(ack);
      }
  }); 
//邮箱验证步骤
  // var email="<"+req.body.email+">";
  // var message="http://115.28.165.86/checksubmit/"+uuid.v1()+"/";  

  // redisClient.hmset(info.email, info, function(err, data){
  //     redisClient.expire(info.email, 60);
  //     if(err) {
  //         console.log(err);
  //         info.ack="false";
  //     } else {
  //       mailTransport.sendMail({
  //           from : "<844725532@qq.com>",
  //           to : email,
  //           subject: "this is a email",
  //           generateTextFromHTML : true,
  //           html : message
  //       }, function(error, response){
  //           if(error){
  //               console.log(error);
  //               info.ack="false";
  //           }else{
  //               console.log("Message sent: " + response.message);
  //               info.ack = "true";
  //           }
  //           mailTransport.close();
  //       });
  //     }
  //     res.json(info);
  // });   
};
//网页端登陆验证
exports.loginsubmit = function(req, res){
  var name    =req.body.myname;
  var password=req.body.password;
  var lastip  =req.ip;
  var lasttime=Date.parse(new Date()); 

  req.session.name=name;

  mongo.collection('users', function(err, collection) {
      collection.find({name:name,password:password}, function(err, data) {
            data.toArray(function(err,arr){
            var info={}
            if(arr.length)
            {
              info.ack=true;
              req.session.name=name;
              collection.update({name:name}, {$set: {lastip:lastip,lasttime:lasttime}}, function(error, data){     
              });
            }else{
              info.ack=false;
            }
            res.json(info);
          })
      });
  });
};

exports.list = function(req, res){
  redisClient.incr("listpage", redis.print);
  res.send("respond with a resource");
};
exports.mqtt2ws = function(req, res){
  redisClient.incr("mqtt2wspage", redis.print);
  res.render('mqtt2ws', { title: 'Express' });
};
exports.echarts = function(req, res){
  redisClient.incr("echartspage", redis.print);
  res.render('echarts', { title: 'Express' });
};
exports.clients = function(req, res){
  redisClient.incr("clientspage", redis.print);
  res.render('clients', { title: 'Express',items:items });
};
exports.sendhtml = function(req, res){
  res.sendfile("/javascripts/echarts.js");
};
exports.bootstrap = function(req, res){
  res.render('bootstrap', { title: 'Express' });
};
exports.baidumap = function(req, res){
  res.render('baidumap', { title: 'Express' });
};
exports.validator = function(req, res){
  res.render('validator', { title: 'Express' });
};
exports.audio = function(req, res){
  res.render('audio', { title: 'Express' });
};

exports.adduser = function(req, res){
  console.log(req.body.name);
  console.log(req.body.age);
  res.render('audio', { title: 'Express' });
};

exports.qrcode = function(req, res){
  res.sendfile('views/qrcode.html');
};
