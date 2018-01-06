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
const assert = require("assert");
const SignatureLogic_1 = require("./SignatureLogic");
const request = require("request");
assert('E8F6F347D549FE514F0C9C452C95DA9D' == SignatureLogic_1.SignatureLogic.paramsToSign({
    text: '腾讯开放平台',
    app_id: 10000,
    time_stamp: '1493449657',
    nonce_str: '20e3408a79'
}, 'a95eceb1ac8c24ee28b70f7dbba912bf'));
class MachineView {
    constructor(appId, appKey) {
        this.appId = appId;
        this.appKey = appKey;
    }
    faceMerge(base64, model) {
        return __awaiter(this, void 0, void 0, function* () {
            var options = {
                app_id: this.appId,
                nonce_str: (Math.random() * 1000000 + '').replace('.', ''),
                time_stamp: Math.round(parseInt((new Date().getTime() / 1000).toFixed(1))),
                model: model,
                image: base64
            };
            var sign = SignatureLogic_1.SignatureLogic.paramsToSign(options, this.appKey);
            options['sign'] = sign;
            var body = yield this.requestApi(MachineView.FACE_MERGE, options, "POST");
            return body;
        });
    }
    /**
     * app_id	是	int	正整数	1000001	应用标识（AppId）
    time_stamp	是	int	正整数	1493468759	请求时间戳（秒级）
    nonce_str	是	string	非空且长度上限32字节	fa577ce340859f9fe	随机字符串
    sign	是	string	非空且长度固定32字节	B250148B284956EC5218D4B0503E7F8A	签名信息，详见接口鉴权
    cosmetic	是	int	正整数	1	美妆编码，定义见下文描述
    image	是	string	原始图片的base64编码数据（大小上限500KB）	...	待处理图
     */
    faceCosmetic(cosmetic, image) {
        return __awaiter(this, void 0, void 0, function* () {
            var options = {
                app_id: this.appId,
                cosmetic,
                image,
                nonce_str: (Math.random() * 1000000 + '').replace('.', ''),
                time_stamp: Math.round(parseInt((new Date().getTime() / 1000).toFixed(1))),
            };
            var sign = options['sign'] = SignatureLogic_1.SignatureLogic.paramsToSign(options, this.appKey);
            var body = yield this.requestApi(MachineView.FACE_COSMETIC, options);
            return body;
        });
    }
    detectFace(image, mode = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            image = image.indexOf('data:image/png;base64,') !== -1 ? image.replace('data:image/png;base64,', '') : image;
            var options = {
                app_id: this.appId,
                mode,
                image,
                nonce_str: (Math.random() * 1000000 + '').replace('.', ''),
                time_stamp: Math.round(parseInt((new Date().getTime() / 1000).toFixed(1))),
            };
            console.log(image);
            var sign = options['sign'] = SignatureLogic_1.SignatureLogic.paramsToSign(options, this.appKey);
            var body = yield this.requestApi(MachineView.FACE_DETECT, options);
            return body;
        });
    }
    requestApi(url, options, method = "Get") {
        var defaultOptions = {
            app_id: this.appId,
            nonce_str: (Math.random() * 1000000 + '').replace('.', ''),
            time_stamp: Math.round(parseInt((new Date().getTime() / 1000).toFixed(1))),
        };
        //Object.assign()
        return new Promise(resolve => {
            var res = request.post({
                url,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, formData: options
            }, (err, res, body) => {
                if (err)
                    console.error('err:', err);
                else {
                    delete options.image;
                    console.log(`request url:${url}   `, options);
                    resolve(JSON.parse(body));
                }
            });
        });
    }
}
/**人脸美妆 */
MachineView.FACE_COSMETIC = "https://api.ai.qq.com/fcgi-bin/ptu/ptu_facecosmetic";
/**人脸融合 */
MachineView.FACE_MERGE = "https://api.ai.qq.com/fcgi-bin/ptu/ptu_facemerge";
MachineView.FACE_DETECT = "https://api.ai.qq.com/fcgi-bin/face/face_detectface";
exports.MachineView = MachineView;
