"use strict";
const QQAI = require("./qqai");
const QRCode = require("./qrcode");
const cloud = require("./cloudinary");
module.exports = {
    qqai: new QQAI("1106550426", "00WdwrKA54aXkVG6"),
    qrcode: new QRCode(),
    wechatJsApi: {},
    cloud
};
