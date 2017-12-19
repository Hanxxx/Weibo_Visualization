"use strict";
const weiboLogin = require('./lib/weibo_login.js').weiboLogin;
const handle = require('./handleData/handle').handle;
const request = require('request');
const fs = require('fs');
const querystring = require('querystring');
(async() => {
    await new weiboLogin('18813298638', '644179052').init();
    let url = 'https://weibo.com/aj/v6/mblog/info/big?ajwvr=6&id=4184283809632269&__rnd=1513192190937'
    console.log("ok");
    handle(url, 800);
})()