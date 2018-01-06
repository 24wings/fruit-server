import Router =  require('koa-router');
import service  = require('../service');
let qqaiRoute = new Router();

/**
 *  @api  /json/qqai/faceMerge  faceMerge
 *  @apiGroup  腾讯人工智能
 */
qqaiRoute.post('/api/qqai/faceMerge',async(ctx,next)=>{
    let { image, model } = ctx.request.body;
            var miniType = image.match(/\/.*;/)[0];
            image = image.replace(`data:image${miniType}base64,`, '');
            console.log("参数：", image, model);
            let data = await service.qqai.machineView.faceMerge(image, model);
            ctx.body = { ok: true, data: data.ret == 0 ? `data:image${miniType}base64,` + data.data.image : data.ret };
})
.post('/api/qqai/faceDetect',async(ctx,next)=>{
    let {image} = ctx.request.body;
  let result = await  service.qqai.machineView.detectFace(image);
  ctx.body=result;
  })

export {
    qqaiRoute
};