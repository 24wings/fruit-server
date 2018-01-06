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
var nodeExcel = require('excel-export');
let fs = require('fs');
let path = require('path');
const Router = require("koa-router");
const db = require("../model");
let fruitClientRouter = new Router();
exports.fruitClientRouter = fruitClientRouter;
fruitClientRouter.get('/', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    yield ctx.redirect('/fruit/home');
}))
    .get('/fruit-client.listRecommandGroups.get', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { adminId, limit } = ctx.query;
    if (!limit)
        limit = 5;
    let groups = yield db.fruitProductGroupModel.find({ admin: adminId }).exec();
    ctx.body = { ok: true, data: groups };
}))
    .post('/fruit-client.userLogin.post', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { adminId } = ctx.query;
    let { phone, password } = ctx.request.body;
    let user = yield db.fruitUserModel.findOne({ admin: adminId, phone, password }).exec();
    if (user) {
        ctx.session['fruitUser'] = user;
    }
    ctx.body = { ok: !!user, data: user ? user : '用户名或者密码错误' };
}))
    .get('/fruit-client.listGroups.get', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { adminId } = ctx.query;
    let groups = yield db.fruitProductGroupModel.find({ admin: adminId }).exec();
    ctx.body = { ok: true, data: groups };
}))
    .get('/fruit-client.getGroupProducts.get', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { adminId, groupId } = ctx.query;
    let products = yield db.fruitProductModel.find({ admin: adminId, group: groupId }).populate('images').exec();
    ctx.body = { ok: true, data: products };
}))
    .get('/fruit-client.getProductById.get', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { adminId, productId } = ctx.query;
    let product = yield db.fruitProductModel.findOne({ _id: productId, admin: adminId }).populate('images').exec();
    ctx.body = { ok: true, data: product };
}))
    .post('/fruit-client.orderProduct.post', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { adminId } = ctx.query;
    let { productId, userId, num } = ctx.request.body;
    if (productId && userId) {
        let fruitOrder = yield new db.fruitOrderModel({ product: productId, orderUser: userId, admin: adminId, num }).save();
        ctx.body = { ok: true, data: fruitOrder };
    }
    else {
        ctx.body = { ok: false, data: '参数不全' };
    }
}))
    .get('/fruit-client.listRecommandProducts.get', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { adminId, limit } = ctx.query;
    // if (!limit) limit = 4;
    if (ctx.session.fruitUser) {
        console.log('fruitUser', ctx.session.fruitUser);
    }
    let recommandProducts = yield db.fruitProductModel.find().populate('images').exec();
    ctx.body = { ok: true, data: recommandProducts };
}))
    .get('/fruit-client.getUserShopingCarOrders.get', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { userId, adminId } = ctx.query;
    let orders = yield db.fruitOrderModel.find({ orderUser: userId, admin: adminId, state: db.FruitOrderState.UnConfirm }).exec();
    for (let order of orders) {
        order.product = yield db.fruitProductModel.findById(order.product).populate('images').exec();
    }
    ctx.body = { ok: true, data: orders };
}))
    .post('/fruit-client.confirmOrder.post', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    // let admin = ctx.query.adminId ;
    let { adminId } = ctx.query;
    // let userId= ctx.request.body.userId 
    // let orderId = ctx.request.body.orderId;
    let { userId, orderId, num } = ctx.request.body;
    let updateAction = yield db.fruitOrderModel.findOneAndUpdate({ _id: orderId, orderUser: userId, admin: adminId }, { state: db.FruitOrderState.SendProduct, num }).exec();
    ctx.body = { ok: true, data: updateAction };
}))
    .del('/fruit-client.removeOrder.del', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { orderId, adminId } = ctx.query;
    let updateAction = yield db.fruitOrderModel.findOneAndUpdate({ _id: orderId, admin: adminId, state: db.FruitOrderState.UnConfirm }, { state: db.FruitOrderState.Remove }).exec();
    ctx.body = { ok: true, data: updateAction };
}))
    .get('/fruit-client.getOldOrders.get', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { userId, adminId } = ctx.query;
    let oldOders = yield db.fruitOrderModel
        .find({ admin: adminId, orderUser: userId, state: { $in: [db.FruitOrderState.Cancel, db.FruitOrderState.SendProduct] } })
        .exec();
    for (let order of oldOders) {
        order.product = yield db.fruitProductModel.findById(order.product).populate('images').exec();
    }
    ctx.body = { ok: true, data: oldOders };
}))
    .post('/fruit-client.buyProduct.post', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { adminId } = ctx.query;
    let { userId, productId } = ctx.request.body;
    let newOrder = yield new db.fruitOrderModel({ orderUser: userId, product: productId, admin: adminId, state: db.FruitOrderState.SendProduct }).save();
    ctx.body = { ok: true, data: newOrder };
}))
    .get('/fruit-client.getRecord.get', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { adminId, startDt, endDt, userId } = ctx.query;
    // let { } = ctx.request.body;
    console.log(startDt, endDt, typeof startDt, typeof endDt);
    if (typeof startDt == 'string') {
        startDt = new Date(parseInt(startDt));
    }
    if (typeof endDt == 'string') {
        endDt = new Date(parseInt(endDt));
    }
    let orders = [];
    if (!userId) {
        orders = yield db.fruitOrderModel.find({ createDt: { $gt: startDt, $lt: endDt }, admin: adminId }).exec();
    }
    else {
        orders = yield db.fruitOrderModel.find({ createDt: { $gt: startDt, $lt: endDt }, admin: adminId, orderUser: userId }).exec();
    }
    for (let order of orders) {
        order.product = yield db.fruitProductModel.findById(order.product).populate('images').exec();
    }
    ctx.body = { ok: true, data: orders };
}))
    .post('/fruit-client.toExcel.post', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { _headers, rows } = ctx.request.body;
    if (rows) {
        rows = JSON.parse(rows);
    }
    ;
    if (!_headers)
        _headers = ['订单时间', '订单发起人', '订单货品', '订单数量', '订单状态'];
    if (!rows)
        rows = [['11', '21', '31', '41', '51']],
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
}));
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
    var conf = { name: '', cols: [], rows: [] };
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
};
