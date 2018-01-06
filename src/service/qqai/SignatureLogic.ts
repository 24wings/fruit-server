import crypto = require('crypto');
var urlencode = require('urlencode');
import querystring = require('querystring')
import { encode } from 'punycode';
export class SignatureLogic {
  static paramsToSign(obj: Object, appKey: string): string {


    var keys = Object.getOwnPropertyNames(obj).sort();
    var str = '';
    keys.forEach(key => str += key + '=' + encodeURIComponent(obj[key]) + '&');
    str += `app_key=${appKey}`;

    var md5 = crypto.createHash('md5');
    var sign = md5.update(str).digest('hex');
    return sign.toUpperCase();
  }


} 
