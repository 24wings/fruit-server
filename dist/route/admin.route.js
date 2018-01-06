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
const db = require("../model");
const fs = require("fs");
const path = require("path");
let adminRouter = new Router();
exports.adminRouter = adminRouter;
/**
 * @api {POST}  /admin.login     adminlogin request
 * @apiGroup admin
 */
adminRouter.post('/admin.signin.post', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { phone, password } = ctx.request.body;
    let admin = yield db.adminModel.findOne({ phone, password }).exec();
    ctx.body = { ok: !!admin, data: admin ? admin : '用户名或密码错误' };
}))
    .post('/admin.signup.post', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { phone, password, nickname } = ctx.request.body;
    let exit = yield db.adminModel.findOne({ phone }).count().exec();
    if (exit > 0) {
        ctx.body = { ok: false, data: '该用户已经注册' };
    }
    else {
        let newAdmin = yield new db.adminModel({ phone, password, nickname }).save();
        ctx.body = { ok: true, data: newAdmin };
    }
}))
    .get('/admin', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let content = fs.readFileSync(path.resolve(__dirname, '../../www/admin/index.html'));
    ctx.body = content;
}));
