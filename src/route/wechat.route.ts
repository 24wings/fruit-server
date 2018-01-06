import fs = require('fs');
import path = require('path');
import Router = require('koa-router');
let wechatRouter = new Router();
var WechatApi = require('wechat-api');
var api = new WechatApi("wx615dbd1b14c5053d","1fc1e1fd93080ae90b412d78167a1e54");



wechatRouter.post('/wechat/ticket',async(ctx,next)=>{
    let str =fs.readFileSync(path.resolve(__dirname,'../../../times.txt'),'utf8');
    let times = str?parseInt(str):0;
    fs.writeFileSync(path.resolve(__dirname,'../../../times.txt'),++times,{encoding:'utf8'});
    var param = {
        debug: false,
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
        url: ctx.request.body.url
       };
var config=         await new Promise(resolove=>{
        api.getJsConfig(param,(err,data)=>resolove(data) );
     });
     ctx.body={ok:true,data:config};

    // let jssdk = await wechat.wechatApi.getJSSDK({url:"http://www.carelifeca.com/"});
    console.log('jssdk:url', ctx.request.body.url)
   console.log('jssdk:href', ctx.href);
});
export {
    wechatRouter
}