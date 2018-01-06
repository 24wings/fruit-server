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
const db = require("../model");
const Router = require("koa-router");
const service = require("../service");
let commonRouter = new Router();
exports.commonRouter = commonRouter;
var ActionType;
(function (ActionType) {
    ActionType[ActionType["FIND"] = 1] = "FIND";
    ActionType[ActionType["UPDATE"] = 2] = "UPDATE";
    ActionType[ActionType["NEW"] = 3] = "NEW";
    ActionType[ActionType["DELETE"] = 4] = "DELETE";
    ActionType[ActionType["FINDONE"] = 5] = "FINDONE";
    ActionType[ActionType["FindByKeyword"] = 6] = "FindByKeyword";
    //创建多个
    ActionType[ActionType["CreateMany"] = 7] = "CreateMany";
})(ActionType || (ActionType = {}));
commonRouter
    .post('/admin.login', (ctx) => {
    var result = ctx.request.body.username == 'moon' && ctx.request.body.password == 'moon';
    ctx.body = { ok: result, data: result ? result : '用户名或密码错误' };
})
    .get('/url', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    yield ctx.render('url');
}))
    .post('/url', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let base64 = yield service.qrcode.urlToQrcode(ctx.request.body.url);
    ctx.body = { ok: true, data: base64 };
}))
    .post('/api.rest.go', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    console.log(ctx.request.body, "======================");
    let { model, type, query, skip, limit, populate, sort, newObject, updateObject } = ctx.request.body;
    let table = db[model];
    if (!model) {
        ctx.body = { ok: false, data: '不存在的查询' };
    }
    else {
        let data = [];
        switch (type) {
            case ActionType.FIND:
                let findAction = table.find(query);
                if (skip)
                    findAction = findAction.skip(skip);
                if (limit)
                    findAction = findAction.limit(limit);
                if (populate)
                    findAction = findAction.populate(populate);
                if (sort)
                    findAction = findAction.sort(sort);
                data = yield findAction.exec();
                ctx.body = { ok: true, data };
                break;
            case ActionType.UPDATE:
                let updateAction = yield table.find(query).update(updateObject);
                ctx.body = { ok: true, data: updateAction };
                break;
            case ActionType.NEW:
                let saveAction = yield new table(newObject).save();
                ctx.body = { ok: true, data: saveAction };
                break;
            case ActionType.DELETE:
                let delAction = yield table.find(query).remove();
                ctx.body = { ok: true, data: delAction };
                break;
            case ActionType.FINDONE:
                let findAction2 = table.find(query);
                if (skip)
                    findAction = findAction2.skip(skip);
                if (limit)
                    findAction = findAction2.limit(limit);
                if (populate)
                    findAction = findAction2.populate(populate);
                if (sort)
                    findAction = findAction2.sort(sort);
                data = yield findAction2.exec();
                ctx.body = { ok: true, data };
                break;
        }
        ctx.body = ctx.body ? ctx.body : data;
    }
}));
