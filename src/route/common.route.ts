import mongoose = require('mongoose');
import db= require('../model');
import Router = require('koa-router');
import service =  require('../service');
let commonRouter = new Router();
enum ActionType {
  FIND=1,
  UPDATE,
  NEW,
  DELETE,
  FINDONE,
  FindByKeyword,
  //创建多个
  CreateMany
}
commonRouter

// .all('/', async(ctx) => {
//   ctx.body =ctx.query.echostr})
.post('/admin.login', (ctx) => {
 var result = ctx.request.body.username == 'moon' && ctx.request.body.password == 'moon';
 ctx.body = { ok: result, data: result ? result : '用户名或密码错误' };
})

 .get('/url', async (ctx, next) => {
    await ctx.render('url');
 })
 .post('/url',async(ctx,next)=>{
  let base64= await  service.qrcode.urlToQrcode(ctx.request.body.url);
  ctx.body={ok:true,data:base64};
 } )

 .post('/api.rest.go',async(ctx,next)=>{
  console.log(ctx.request.body,"======================");
    let { model, type, query, skip, limit, populate, sort, newObject,updateObject } = ctx.request.body;
    let table: mongoose.Model<any> = <any>db[model];
    if (!model) {
        ctx.body = { ok: false, data: '不存在的查询' };
    } else {
        let data:any[] = [];
        switch (type) {
            case ActionType.FIND:
            
                let findAction = table.find(query);
                if (skip) findAction = findAction.skip(skip);
                if (limit) findAction = findAction.limit(limit);
                if (populate) findAction = findAction.populate(populate);
                if (sort) findAction = findAction.sort(sort);
                data = await findAction.exec();
                ctx.body = { ok: true, data }
                break;
            case ActionType.UPDATE:
                let updateAction = await table.find(query).update(updateObject);
                ctx.body = { ok: true, data: updateAction };
                break;
            case ActionType.NEW:
                let saveAction = await new table(newObject).save();
                ctx.body = { ok: true, data: saveAction };
                break;
            case ActionType.DELETE:
                let delAction = await table.find(query).remove();
                ctx.body = { ok: true, data: delAction };
                break;
            case ActionType.FINDONE:
            let findAction2 = table.find(query);
            if (skip) findAction = findAction2.skip(skip);
            if (limit) findAction = findAction2.limit(limit);
            if (populate) findAction = findAction2.populate(populate);
            if (sort) findAction = findAction2.sort(sort);
            data = await findAction2.exec();
            ctx.body = { ok: true, data }
            break;
        
    }
    ctx.body=ctx.body?ctx.body:data;

    

}

 })
export {
  commonRouter 
}