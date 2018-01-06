import Router = require('koa-router');
import db = require('../model');
import fs = require('fs');
import path = require('path');
let adminRouter = new Router();

/**
 * @api {POST}  /admin.login     adminlogin request
 * @apiGroup admin 
 */
adminRouter.post('/admin.signin.post', async (ctx, next) => {
    let { phone, password } = ctx.request.body;
    let admin = await db.adminModel.findOne({ phone, password }).exec();
    ctx.body = { ok: !!admin, data: admin ? admin : '用户名或密码错误' }
})
    .post('/admin.signup.post', async (ctx, next) => {
        let { phone, password, nickname } = ctx.request.body;
        let exit = await db.adminModel.findOne({ phone }).count().exec();
        if (exit > 0) {
            ctx.body = { ok: false, data: '该用户已经注册' }
        } else {
            let newAdmin = await new db.adminModel({ phone, password, nickname }).save();
            ctx.body = { ok: true, data: newAdmin };
        }
    })



    .get('/admin', async (ctx, next) => {
        let content = fs.readFileSync(path.resolve(__dirname, '../../www/admin/index.html'));
        ctx.body = content;
    })



export { adminRouter }