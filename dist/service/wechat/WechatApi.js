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
const WechatTool_1 = require("./WechatTool");
const crypto = require("crypto");
var WechatAPI = require('wechat-api');
/**
 * access_token官方文档    https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183
 */
class default_1 {
    constructor(appId, appSecrt) {
        this.appId = appId;
        this.appSecrt = appSecrt;
        this.URLS = {
            //&appid=APPID&secret=APPSECRET
            accessToken: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential',
            //access_token=ACCESS_TOKEN&type=jsapi
            ticket: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi'
        };
        //私有的token
        this.token = {
            access_token: '',
            expires_in: 0,
            lastModifyTime: 0
        };
        this.ticket = {
            ticket: '',
            expires_in: 0,
            lastModifyTime: 0
        };
        this.api = new WechatAPI(appId, appSecrt);
    }
    /**
     * noncestr=Wm3WZYTPz0wzccnW
        jsapi_ticket=sM4AOVdWfPE4DxkXGEs8VMCPGGVi4C3VM0P37wVUCFvkVAy_90u5h9nbSlYy3-Sl-HhTdfl2fzFy1AOcHKP7qg
        timestamp=1414587457
        url=http://mp.weixin.qq.com?params=value
     */
    jssdk(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!opt.jsapi_ticket) {
                opt.jsapi_ticket = yield this.getTicket();
            }
            if (!opt.timestamp)
                opt.timestamp = parseInt(WechatTool_1.default.generateTimestamp());
            if (!opt.noncestr)
                opt.noncestr = yield WechatTool_1.default.getRadomStr();
            let str = `jsapi_ticket=${opt.jsapi_ticket}&noncestr=${opt.noncestr}&timestamp=${opt.timestamp}&url=${opt.url}`;
            let sha1 = crypto.createHash('sha1');
            let sign = sha1.update(str).digest('hex');
            return {
                debug: false,
                appId: this.appId,
                timestamp: opt.timestamp,
                nonceStr: opt.noncestr,
                signature: sign,
            };
        });
    }
    //若不传入token,则自动调用底层方法获取token,若传入token,则使用token
    getTicket(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isTicketValid) {
                if (!token) {
                    token = yield this.getAccessToken();
                }
                let ticketStr = yield WechatTool_1.default.httpsGet(this.URLS.ticket + `&access_token=${token}`);
                let ticket = JSON.parse(ticketStr);
                this.ticket.ticket = ticket.ticket;
                this.ticket.expires_in = ticket.expires_in;
                this.ticket.lastModifyTime = new Date().getTime();
                console.log(ticket);
            }
            return this.ticket.ticket;
        });
    }
    get isTicketValid() {
        return !!this.ticket.ticket && new Date().getTime() <= this.ticket.lastModifyTime + this.ticket.expires_in * 1000 && !!this.ticket.lastModifyTime;
    }
    get isTokenValid() {
        return !!this.token.access_token && new Date().getTime() <= this.token.lastModifyTime + this.token.expires_in * 1000 && !!this.token.lastModifyTime;
    }
    /**
     * 自动缓存access_token,开心大胆的用吧
     */
    getAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isTokenValid) {
                let tokenStr = yield WechatTool_1.default.httpsGet(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appId=${this.appId}&secret=${this.appSecrt}`);
                let token = JSON.parse(tokenStr);
                this.token.access_token = token.access_token;
                this.token.lastModifyTime = new Date().getTime();
                this.token.expires_in = parseInt(token.expires_in);
            }
            return this.token.access_token;
        });
    }
    getSDKParams(param, url) {
        var param = param || {
            debug: false,
            jsApiList: ['checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'translateVoice',
                'startRecord',
                'stopRecord',
                'onVoiceRecordEnd',
                'playVoice',
                'onVoicePlayEnd',
                'pauseVoice',
                'stopVoice',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'getNetworkType',
                'openLocation',
                'getLocation',
                'hideOptionMenu',
                'showOptionMenu',
                'closeWindow',
                'scanQRCode',
                'chooseWXPay',
                'openProductSpecificView',
                'addCard',
                'chooseCard',
                'openCard'],
            url: param.url ? param.url : url
        };
        return new Promise((resolve, reject) => {
            this.api.getJsConfig(param, (err, data) => {
                if (err)
                    console.log(err);
                resolve(data);
            });
        });
    }
    getJSSDK(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = yield this.getSDKParams(opt);
            var signature = yield this.getSignature({ noncestr: params['nonceStr'], timestamp: params['timestamp'], url: opt.url });
            params['signature'] = signature;
            return params;
        });
    }
    getSignature(opt) {
        return new Promise((resolve, reject) => {
            this.api.getTicket((err, result) => {
                if (err)
                    console.error(err);
                console.log(result, opt.url);
                var str = '';
                str += 'jsapi_ticket=' + result.ticket;
                str += '&noncestr=' + opt.noncestr;
                str += '&timestamp=' + opt.timestamp;
                str += '&url=' + opt.url;
                var sha1 = crypto.createHash('sha1');
                var signatrue = sha1.update(str).digest('hex');
                console.log(str);
                console.log(signatrue);
                resolve(signatrue);
            });
        });
    }
}
exports.default = default_1;
