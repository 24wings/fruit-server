"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
var urlencode = require('urlencode');
class SignatureLogic {
    static paramsToSign(obj, appKey) {
        var keys = Object.getOwnPropertyNames(obj).sort();
        var str = '';
        keys.forEach(key => str += key + '=' + encodeURIComponent(obj[key]) + '&');
        str += `app_key=${appKey}`;
        var md5 = crypto.createHash('md5');
        var sign = md5.update(str).digest('hex');
        return sign.toUpperCase();
    }
}
exports.SignatureLogic = SignatureLogic;
