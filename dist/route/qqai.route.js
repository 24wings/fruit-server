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
const Router = require("koa-router");
const service = require("../service");
let qqaiRoute = new Router();
exports.qqaiRoute = qqaiRoute;
/**
 *  @api  /json/qqai/faceMerge  faceMerge
 *  @apiGroup  腾讯人工智能
 */
qqaiRoute.post('/api/qqai/faceMerge', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { image, model } = ctx.request.body;
    var miniType = image.match(/\/.*;/)[0];
    image = image.replace(`data:image${miniType}base64,`, '');
    console.log("参数：", image, model);
    let data = yield service.qqai.machineView.faceMerge(image, model);
    ctx.body = { ok: true, data: data.ret == 0 ? `data:image${miniType}base64,` + data.data.image : data.ret };
}))
    .post('/api/qqai/faceDetect', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { image } = ctx.request.body;
    let result = yield service.qqai.machineView.detectFace(image);
    ctx.body = result;
}));
