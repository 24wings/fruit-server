var md5 = require('md5');
var xml2js = require('xml2js');
import https = require('https');   
export default new class {
    urls = {
        /**
         * 企业付款到个人
         */
        transfers: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers',
        /**微信授权认证  */
        oauth: {
            auth: 'https://open.weixin.qq.com/connect/oauth2/authorize',

        },

        PAY: {
            UNIFIED_ORDER: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
            ORDER_QUERY: 'https://api.mch.weixin.qq.com/pay/orderquery',
            REFUND: 'https://api.mch.weixin.qq.com/secapi/pay/refund',
            REFUND_QUERY: 'https://api.mch.weixin.qq.com/pay/refundquery',
            DOWNLOAD_BILL: 'https://api.mch.weixin.qq.com/pay/downloadbill',
            SHORT_URL: 'https://api.mch.weixin.qq.com/tools/shorturl',
            CLOSE_ORDER: 'https://api.mch.weixin.qq.com/pay/closeorder'
        }
    }
    async parseXml(xml: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let parser = new xml2js.Parser();
            parser.parseString(xml, (err, xml) => {
                if (err) console.log(err);
                resolve(xml)
            });
        });
    }
    bulildXml(obj: Object) {
        let builder = new xml2js.Builder();
        return builder.buildObject(obj);
    }
    buildSignStr(obj: Object) {
        var str = '';
        for (let key in obj) {
            str += `&${key}=${obj[key]}`;
        }
        str = str.startsWith(`&`) ? str.substring(1) : str;
        return str;
    }
    /**对象转查询字符串并字典升序
     * 
     * {
     * name:'jay',
     * age:23
     * }
     * 
     * 生成=>    ?name=jay&age=23
     * 
      */
    createQueryString(options: Object) {
        return Object.getOwnPropertyNames(options)
            .filter(key => options[key] !== undefined && options[key] !== '' && ['pfx', 'apiKey', 'sign', 'key'].indexOf(key) < 0)
            .sort().map(key => key + '=' + options[key])
            .join('&');
    }

    sign(options: Object, key?: string) {
        let queryStr
        if (key) {
            queryStr = this.createQueryString(options) + `&key=` + key;
        } else {
            queryStr = this.createQueryString(options);
        }
        return md5(queryStr).toUpperCase();
    }
    getRadomStr(length = 32) {
        length = length || 24;
        if (length > 32) length = 32;
        return (Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)).substr(0, length);
    }
    /** 获取部署机器的IP地址 */
    getSelfIp() {
        var interfaces = require('os').networkInterfaces();
        for (var devName in interfaces) {
            var iface = interfaces[devName];
            for (var i = 0; i < iface.length; i++) {
                var alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }

    }

    generateTimestamp() {
        return parseInt((new Date().getTime() / 1000).toString(), 10) + '';
    }

    httpsGet(url: string): Promise<string> {
        return new Promise((resolve, reject) => https.get(url, (res) => {
            let content = '';
            res.on('data', (data) => {
                content += data;
            });
            res.on('end', () => {
                resolve(content);
            })
        }));

    }
    getClientIp(req) {
        return req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    }

}