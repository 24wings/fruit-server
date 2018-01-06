import qrcodeImage = require('qr-image');
export = class Qrcode {


    urlToQrcode(url, type: 'svg' | 'png' = 'png') {
        let result = qrcodeImage.imageSync(url, { type });

        if (type = 'png') {
            let base64 = (result as Buffer).toString('base64');
            console.log(base64);
            return base64;
        } else {
            return result;
        }


    }

}