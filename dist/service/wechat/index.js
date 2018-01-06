"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WechatApi_1 = require("./WechatApi");
exports.default = new class {
    constructor() {
        this.appid = "wx06085bff311745d8";
        this.appiSecret = "36cc8b633770026d27440d163e2f8492";
        this.wechatApi = new WechatApi_1.default(this.appid, this.appiSecret);
    }
};
