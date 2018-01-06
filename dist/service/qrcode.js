"use strict";
const qrcodeImage = require("qr-image");
module.exports = class Qrcode {
    urlToQrcode(url, type = 'png') {
        let result = qrcodeImage.imageSync(url, { type });
        if (type = 'png') {
            let base64 = result.toString('base64');
            console.log(base64);
            return base64;
        }
        else {
            return result;
        }
    }
};
