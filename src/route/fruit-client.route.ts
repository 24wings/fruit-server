var nodeExcel = require('excel-export');
let fs = require('fs');
let path = require('path');
import Router = require('koa-router');

import db = require('../model');
import { sessionProps } from 'koa-session';
let fruitClientRouter = new Router();
fruitClientRouter.get('/', async (ctx, next) => {
    await ctx.redirect('/fruit/home')
})
    // 获取推荐产品
    .get('/fruit-client.listRecommandGroups.get', async (ctx, next) => {
        let { adminId, limit } = ctx.query;
        if (!limit) limit = 5;
        let groups = await db.fruitProductGroupModel.find({ admin: adminId }).exec();
        ctx.body = { ok: true, data: groups };
    })
    .post('/fruit-client.userLogin.post', async (ctx, next) => {
        let { adminId } = ctx.query;
        let { phone, password } = ctx.request.body;

        let user = await db.fruitUserModel.findOne({ admin: adminId, phone, password }).exec();
        if (user) {
            (ctx.session as any)['fruitUser'] = user;
        }
        ctx.body = { ok: !!user, data: user ? user : '用户名或者密码错误' };
    })
    .get('/fruit-client.listGroups.get', async (ctx, next) => {
        let { adminId } = ctx.query;
        let groups = await db.fruitProductGroupModel.find({ admin: adminId }).exec();
        ctx.body = { ok: true, data: groups };
    })
    .get('/fruit-client.getGroupProducts.get', async (ctx, next) => {
        let { adminId, groupId } = ctx.query;
        let products = await db.fruitProductModel.find({ admin: adminId, group: groupId }).populate('images').exec();
        ctx.body = { ok: true, data: products };

    })
    .get('/fruit-client.getProductById.get', async (ctx, next) => {
        let { adminId, productId } = ctx.query;
        let product = await db.fruitProductModel.findOne({ _id: productId, admin: adminId }).populate('images').exec();
        ctx.body = { ok: true, data: product };
    })
    // 下订单
    .post('/fruit-client.orderProduct.post', async (ctx, next) => {
        let { adminId } = ctx.query;
        let { productId, userId, num } = ctx.request.body;
        if (productId && userId) {
            let fruitOrder = await new db.fruitOrderModel({ product: productId, orderUser: userId, admin: adminId, num }).save();
            ctx.body = { ok: true, data: fruitOrder };
        } else {
            ctx.body = { ok: false, data: '参数不全' };
        }
    })
    .get('/fruit-client.listRecommandProducts.get', async (ctx, next) => {
        let { adminId, limit } = ctx.query;
        // if (!limit) limit = 4;
        if (ctx.session.fruitUser) { console.log('fruitUser', ctx.session.fruitUser); }
        let recommandProducts = await db.fruitProductModel.find().populate('images').exec();
        ctx.body = { ok: true, data: recommandProducts };
    })

    // 查询 订单状态为 未确认的订单
    .get('/fruit-client.getUserShopingCarOrders.get', async (ctx, next) => {
        let { userId, adminId } = ctx.query;
        let orders = await db.fruitOrderModel.find({ orderUser: userId, admin: adminId, state: db.FruitOrderState.UnConfirm }).exec();
        for (let order of orders) {
            order.product = await db.fruitProductModel.findById(order.product).populate('images').exec();
        }
        ctx.body = { ok: true, data: orders }
    })
    // 确认订单  订单将由未确认转为待发货,
    .post('/fruit-client.confirmOrder.post', async (ctx, next) => {
        // let admin = ctx.query.adminId ;
        let { adminId } = ctx.query;
        // let userId= ctx.request.body.userId 
        // let orderId = ctx.request.body.orderId;

        let { userId, orderId, num } = ctx.request.body;
        let updateAction = await db.fruitOrderModel.findOneAndUpdate({ _id: orderId, orderUser: userId, admin: adminId }, { state: db.FruitOrderState.SendProduct, num }).exec();
        ctx.body = { ok: true, data: updateAction };
    })
    // 移除购物车订单
    .del('/fruit-client.removeOrder.del', async (ctx, next) => {
        let { orderId, adminId } = ctx.query;
        let updateAction = await db.fruitOrderModel.findOneAndUpdate({ _id: orderId, admin: adminId, state: db.FruitOrderState.UnConfirm }, { state: db.FruitOrderState.Remove }).exec();
        ctx.body = { ok: true, data: updateAction };
    })
    .get('/fruit-client.getOldOrders.get', async (ctx, next) => {
        let { userId, adminId } = ctx.query;
        let oldOders = await db.fruitOrderModel
            .find({ admin: adminId, orderUser: userId, state: { $in: [db.FruitOrderState.Cancel, db.FruitOrderState.SendProduct] } })
            .exec();
        for (let order of oldOders) {
            order.product = await db.fruitProductModel.findById(order.product).populate('images').exec();
        }


        ctx.body = { ok: true, data: oldOders }
    })

    // 直接购买产品
    .post('/fruit-client.buyProduct.post', async (ctx, next) => {
        let { adminId } = ctx.query;
        let { userId, productId } = ctx.request.body;
        let newOrder = await new db.fruitOrderModel({ orderUser: userId, product: productId, admin: adminId, state: db.FruitOrderState.SendProduct }).save();
        ctx.body = { ok: true, data: newOrder };
    })
    .get('/fruit-client.getRecord.get', async (ctx, next) => {
        let { adminId, startDt, endDt, userId } = ctx.query;
        // let { } = ctx.request.body;
        console.log(startDt, endDt, typeof startDt, typeof endDt);
        if (typeof startDt == 'string') {
            startDt = new Date(parseInt(startDt));
        }
        if (typeof endDt == 'string') {
            endDt = new Date(parseInt(endDt));
        }
        let orders: any[] = [];
        if (!userId) {
            orders = await db.fruitOrderModel.find({ createDt: { $gt: startDt, $lt: endDt }, admin: adminId }).exec();
        } else {
            orders = await db.fruitOrderModel.find({ createDt: { $gt: startDt, $lt: endDt }, admin: adminId, orderUser: userId }).exec();
        }
        for (let order of orders) {
            order.product = await db.fruitProductModel.findById(order.product).populate('images').exec();
        }

        ctx.body = { ok: true, data: orders };
    })
    .post('/fruit-client.toExcel.post', async (ctx, next) => {
        let { _headers, rows } = ctx.request.body;
        if (rows) { rows = JSON.parse(rows) };

        if (!_headers) _headers = ['订单时间', '订单发起人', '订单货品', '订单数量', '订单状态'];
        if (!rows) rows = [['11', '21', '31', '41', '51']],
            console.log(rows);

        //    rows.forEach(row=>{
        //         if(row.createDt){
        //             row.createDt= new Date(row.createDt).toLocaleString()
        //         }
        //         });


        console.log(_headers, rows);
        var result = exportExcel(_headers, rows);
        fs.writeFileSync(path.resolve(__dirname, '../../www/test.xlsx'), result);

        ctx.set('Content-Type', 'application/vnd.openxmlformats');
        ctx.set("Content-Disposition", "attachment; filename=" + "test.xlsx");
        ctx.body = { ok: true, data: 'test.xlsx' };
    });

/**
* 导出excel
* @param _headers example  [
{caption:'用户状态',type:'string'},
{caption:'部门',type:'string'},
{caption:'姓名',type:'string'},
{caption:'邮箱',type:'string'},
{caption:'有效期',type:'string'},
{caption:'身份',type:'string'}];
* @param rows example 
[['未激活','信息部','testname','123@qq.com','2019-11-09','管理员'],
['未激活','信息部','testname2','12345@qq.com','2019-11-09','普通成员']]
*/
let exportExcel = function (_headers, rows) {
    var conf: { name: string, cols: any[], rows: any[] } = { name: '', cols: [], rows: [] };
    conf.name = "mysheet";
    conf.cols = [];
    for (var i = 0; i < _headers.length; i++) {
        var col = { caption: '', type: '' };
        col.caption = _headers[i];
        col.type = 'string';
        conf.cols.push(col);
    }
    conf.rows = rows;
    var result = nodeExcel.execute(conf);
    return result;
}


export { fruitClientRouter }





