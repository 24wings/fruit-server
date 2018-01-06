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
const service = require("../service");
let fruitRouter = new Router();
exports.fruitRouter = fruitRouter;
fruitRouter.get('/fruit.userlist.get', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { adminId } = ctx.query;
    let users = yield db.fruitUserModel.find({ admin: adminId }).exec();
    ctx.body = { ok: true, data: users };
}))
    .post('/fruit.createUser.post', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { adminId, nickname, password, phone } = ctx.request.body;
    // 查看是否含有该管理员的手机号的用户
    let count = yield db.fruitUserModel.find({ phone, admin: adminId }).count().exec();
    if (count > 0) {
        ctx.body = { ok: false, data: '该用户已经添加' };
    }
    else {
        let newFruitUser = yield new db.fruitUserModel({ admin: adminId, nickname, password, phone }).save();
        ctx.body = { ok: true, data: newFruitUser };
    }
}))
    .del('/fruit.deleteFruitUser.del', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { adminId, userId } = ctx.request.query;
    let count = yield db.fruitUserModel.find().count();
    let fruitUser = yield db.fruitUserModel.findOne({ admin: adminId, _id: userId }).exec();
    if (fruitUser) {
        yield fruitUser.remove();
    }
    ctx.body = { ok: true, data: count };
}))
    .get('/fruit.searchUserlist.get', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { keyword, adminId } = ctx.query;
    if (adminId) {
        let users = [];
        if (!keyword) {
            users = (yield db.fruitUserModel.find({ admin: adminId }).exec());
        }
        else {
            users = (yield db.fruitUserModel.find({ $or: [{ nickname: new RegExp(keyword, 'g') }, { phone: new RegExp(keyword, 'g') }], admin: adminId }).exec());
        }
        ctx.body = { ok: true, data: users };
    }
    else {
        ctx.body = { ok: true, data: [] };
    }
}))
    .put('/fruit.updateUser.put', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { userId, adminId } = ctx.query;
    let newUser = ctx.request.body;
    if (newUser && adminId && userId) {
        let exit = yield db.fruitUserModel.findOne({ admin: adminId, phone: newUser.phone }).exec();
        if (exit) {
            ctx.body = { ok: false, data: '该手机号已经注册' };
        }
        else {
            let updateAction = db.fruitUserModel.findOneAndUpdate({ admin: adminId, userId: userId }, newUser).exec();
            ctx.body = { ok: true, data: updateAction };
        }
    }
    else {
        ctx.body = { ok: false, data: '参数不全' };
    }
}))
    .get('/fruit.productGroups.get', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { adminId } = ctx.query;
    let productGroups = yield db.fruitProductGroupModel.find({ admin: adminId }).populate('image').exec();
    ctx.body = { ok: true, data: productGroups };
}))
    .post('/fruit.createProductGroup.post', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { adminId } = ctx.query;
    let { image, name, isRecommand } = ctx.request.body;
    if (name && image) {
        // let admin  = await db.adminModel.findById(adminId).exec()
        let result = yield service.cloud.uploadImage(image);
        result.admin = adminId;
        result.appName = 'fruit';
        let newImage = yield new db.cloudinaryImageModel(result).save();
        let newProductGroup = yield new db.fruitProductGroupModel({ name: name, admin: adminId, image: newImage._id }).save();
        ctx.body = { ok: true, data: newProductGroup };
    }
    else {
        ctx.body = { ok: false, data: '参数不全' };
    }
}))
    .put('/fruit.updateProductGroup.put', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { adminId, groupId } = ctx.query;
    let newGroup = ctx.request.body;
    if (newGroup.image.length > 200) {
        let result = yield service.cloud.uploadImage(newGroup.image);
        result.admin = adminId;
        result.appName = 'fruit';
        let newImage = yield new db.cloudinaryImageModel(result).save();
        newGroup.image = newImage._id;
    }
    let updateAction = yield db.fruitProductGroupModel.findOneAndUpdate({ admin: adminId, _id: groupId }, newGroup);
    ctx.body = { ok: true, data: updateAction };
}))
    .del('/fruit.deleteProductGroup.del', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { adminId, groupId } = ctx.query;
    let removeAction = yield db.fruitProductGroupModel.findOne({ _id: groupId, admin: adminId }).remove();
    ctx.body = { ok: true, data: removeAction };
}))
    .get('/fruit.productGroupProducts.get', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { adminId, groupId } = ctx.query;
    let group = yield db.fruitProductGroupModel.findOne({ admin: adminId, _id: groupId }).populate('image').exec();
    let products = [];
    if (group) {
        products = yield db.fruitProductModel.find({ _id: { $in: group.products } }).populate('images').exec();
        group.products = products;
    }
    else {
    }
    ctx.body = { ok: true, data: group };
}))
    .post('/fruit.createProduct.post', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { adminId, groupId } = ctx.query;
    let newProduct = ctx.request.body;
    /**将产品图片上传 */
    let images = newProduct.images ? newProduct.images : [];
    let imageItems = yield service.cloud.storeImages(images, adminId, 'fruit');
    newProduct.images = imageItems.map(item => item._id);
    newProduct.admin = adminId;
    let saveProduct = yield new db.fruitProductModel(newProduct).save();
    //更新父亲产品下的产品列表
    yield db.fruitProductGroupModel.findOne({ _id: groupId, admin: adminId }).update({ $push: { products: saveProduct._id } }).exec();
    ctx.body = { ok: true, data: saveProduct };
}))
    .del('/fruit.deleteProduct.del', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { adminId, productId } = ctx.query;
    let removeAction = yield db.fruitProductModel.findOne({ _id: productId, admin: adminId }).remove();
    ctx.body = { ok: true, data: removeAction };
}))
    .put('/fruit.updateProduct.put', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let { adminId, productId } = ctx.query;
    let newProduct = ctx.request.body;
    // newProduct.images = [];
    let images = newProduct.images;
    images = yield service.cloud.storeImages(images, adminId, 'fruit');
    newProduct.images = images.map(image => image._id);
    if (newProduct._id)
        delete newProduct._id;
    let updateAction = yield db.fruitProductModel.findOneAndUpdate({ admin: adminId, _id: productId }, newProduct).exec();
    console.log(adminId, productId, newProduct, updateAction);
    ctx.body = { ok: true, data: updateAction };
}));
