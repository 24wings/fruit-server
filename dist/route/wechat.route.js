"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const Router = require("koa-router");
let wechatRouter = new Router();
exports.wechatRouter = wechatRouter;
var WechatApi = require('wechat-api');
var api = new WechatApi("wx615dbd1b14c5053d", "1fc1e1fd93080ae90b412d78167a1e54");
wechatRouter.post('/wechat/ticket', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let str = fs.readFileSync(path.resolve(__dirname, '../../../times.txt'), 'utf8');
    let times = str ? parseInt(str) : 0;
    fs.writeFileSync(path.resolve(__dirname, '../../../times.txt'), ++times, { encoding: 'utf8' });
    var param = {
        debug: false,
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
        url: ctx.request.body.url
    };
    var config = yield new Promise(resolove => {
        api.getJsConfig(param, (err, data) => resolove(data));
    });
    ctx.body = { ok: true, data: config };
    // let jssdk = await wechat.wechatApi.getJSSDK({url:"http://www.carelifeca.com/"});
    console.log('jssdk:url', ctx.request.body.url);
    console.log('jssdk:href', ctx.href);
}));
