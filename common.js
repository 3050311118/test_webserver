var request = require('request');
var qs = require('querystring');
var fs = require('fs');
var config = require('./config');
var tokenValue={};

function getAccessToken() {
  var queryParams = {
    'grant_type': 'client_credential',
    'appid': config.appId,
    'secret': config.appSecret
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

var refreshToken = function () {
  setInterval(getAccessToken, 20000);
};

module.exports = refreshToken;
