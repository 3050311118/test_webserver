var cluster = require('cluster');
var http = require('http');
var path = require('path');
var ejs = require('ejs');
var routes = require('./routes');
var express = require('express');
var app = express();   

var numCPUs = require('os').cpus().length;
console.log(numCPUs);
// all environments
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));//__dirname
app.engine('html',ejs.__express);
app.set('view engine', 'html');

// app.use(express.basicAuth("gys","123"));
app.use(express.cookieParser());
app.use(express.session({secret:"test"}));
app.use(express.favicon(path.join(__dirname, 'public/favicon.ico'))) 
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.query());
app.use(express.bodyParser());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/sysinfo_cn.html',function(req,res){
  res.setHeader("Cache-Control", "max-age=7200");
  res.sendfile("sysinfo_cn.html");
});
app.get('/account_cn.html',function(req,res){
  res.setHeader("Cache-Control", "max-age=7200");
  res.sendfile("account_cn.html");
});
app.get('/settings_cn.html',function(req,res){
  res.sendfile("settings_cn.html");
});
app.get('/netinfo_cn.html',function(req,res){
  res.sendfile("netinfo_cn.html");
});
app.get('/index.html',function(req,res){
  res.sendfile("index.html");
});
app.get('/network_cn.html',function(req,res){
  res.sendfile("network_cn.html");
});
app.get('/restart_cn.html',function(req,res){
  res.sendfile("restart_cn.html");
});
app.get('/restore_cn.html',function(req,res){
  res.sendfile("restore_cn.html");
});
app.get('/sysinfo_cn.html',function(req,res){
  res.sendfile("sysinfo_cn.html");
});
app.get('/server_cn.html',function(req,res){
  res.sendfile("server_cn.html");
});
app.get('/offline.html',function(req,res){
  res.sendfile("views/offline.html");
})


app.get('/sysinfo',function(req,res){
  var jsonStr={};
  jsonStr.sn="xxbbaacc";
  jsonStr.ver="1.0.0.2";
  jsonStr.staip="192.168.1.2";
  jsonStr.stamac="11223366554";
  jsonStr.apip="123";
  jsonStr.apmac="223355458";
  console.log(JSON.stringify(jsonStr))
  res.json(jsonStr);
});
app.get('/network',function(req,res){
  var jsonStr={};
  jsonStr.apssid="apssid";
  jsonStr.appasswd="appasswd";
  jsonStr.stassid="stassid";
  jsonStr.stapasswd="stapasswd";
  console.log(JSON.stringify(jsonStr))
  res.json(jsonStr);
});
app.get('/account',function(req,res){
  var jsonStr={};
  jsonStr.oldname="oldname";
  jsonStr.oldpasswd="oldpasswd";
  jsonStr.newname="newname";
  jsonStr.newpasswd="newpasswd";
  console.log(JSON.stringify(jsonStr))
  res.json(jsonStr);
});
app.get('/netinfo',function(req,res){
    var jsonStr={};
  jsonStr.ipaddr="111111";
  jsonStr.macaddr="222222";
  jsonStr.gateway="333333";
  jsonStr.subnet="444444";
  console.log(JSON.stringify(jsonStr))
  res.json(jsonStr);
});
app.get('/server',function(req,res){
  var jsonStr={};
  jsonStr.serverip="serverip";
  jsonStr.serverport="serverport";
  jsonStr.uptime="uptime";
  console.log(JSON.stringify(jsonStr))
  res.json(jsonStr);
});


//网页接口
app.get('/', routes.index);
app.get('/snlogin.html',routes.snlogin);
app.get('/webconfig.html',routes.webconfig);
app.get('/login.html',routes.login);
app.get('/register.html',routes.register);
app.get('/manager.html',routes.manager);
app.get('/echarts.html',routes.echarts);
app.get('/top.html',routes.top);
app.get('/left.html',routes.left);
app.get('/main.html',routes.main);
app.get('/messagecenter.html',routes.messagecenter);
app.get('/deviceedit.html',routes.deviceedit);
app.get('/devicelist/:name',routes.devicelist);
app.get('/gatewayedit.html',routes.gatewayedit);
app.get('/gatewaylist.html',routes.gatewaylist);//网关列表
app.get('/devicedata/:sn',routes.devicedata);//打开数据操作页面
app.get('/querydevdata/:sn/:from/:to',routes.querydevdata);//查询时间范围的数据
app.get('/home.html',routes.home);
app.get('/highcharts.html',routes.highcharts);
app.get('/roomlogin.html',routes.roomlogin);
app.post('/roomcheck',routes.roomcheck);

app.get('/audio.html',function(req,res){
  res.render("audio");
})
app.put("/aaa",function(req,res){

})
app.delete("/aaa",function(){
  
})

app.get('/test',function(req,res){
  res.send("hello world[[");
})
app.post('/test',function(req,res){
  console.log(req.body);
  // res.send();
  res.end("hello world");
  // req.rawBody='';
  // req.on('data',function(chunk){
  //   req.rawBody += chunk;
  // })
  // req.on('end',function(){
  //   console.log(req.rawBody)
  // })
})

//restful接口
app.get('/wechat', routes.wechat);
app.post('/wechat', routes.wechat);
app.post('/checksn',routes.checksn);
app.post('/checkemail',routes.checkemail);
app.post('/checkname',routes.checkname);
app.get('/getdatas',routes.getdatas);
app.get('/checksubmit/:email/:name',routes.checksubmit);
app.post('/registersubmit',routes.registersubmit);
app.post('/mobileregistersubmit',routes.mobileregistersubmit)
app.post('/loginsubmit',routes.loginsubmit);
app.get('/logout',routes.logout);
app.get('/checkrandom/:sn',routes.checkrandom)
app.post('/snconfirm',routes.snconfirm)

//同步服务器和手机数据
app.get('/syncinfo/:username',routes.syncinfo);//服务器向手机同步数据
app.get('/deldev/:username/:sn?',routes.deldev);//手机向服务器同步数据
app.get('/adddev/:username/:sn',routes.adddev);//手机向服务器同步数据


app.get('/users', routes.list);
app.get('/mqtt2ws',routes.mqtt2ws);
app.get('/echarts',routes.echarts);
app.get('/clients',routes.clients);
app.get('/bootstrap',routes.bootstrap);
app.get('/baidumap',routes.baidumap);
app.get('/validator',routes.validator);
app.get('/audio',routes.audio);
app.post('/adduser',routes.adduser);

app.get('/qrcode',routes.qrcode);
app.get('/download/*', function (req, res, next) {
  var f = req.params[0];
  f = path.resolve(f);
  console.log('Download file: %s', f);
  res.download(f);
});

app.post('/submit',function(req, res){
    req.session.name=req.body.name;
    req.session.pwd=req.body.pwd;
   var ip = req.ip;
   console.log(ip+"");
   res.redirect('/login');
});

app.get('/login', function(req, res){
   console.log("login");
   res.render('login', { name: req.session.name,pwd: req.session.pwd});
});
// app.get('*', function(req, res){
//    console.log("404");
//    res.end("404");
// });
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port' + app.get('port'));
});
