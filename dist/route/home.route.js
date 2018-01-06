"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const Router = require("koa-router");
let clientHtml = fs.readFileSync(path.resolve(__dirname, '../../public/client/index.html'));
let homeRouter = new Router();
// /**302重定向  */
// homeRouter.get('/redirect',async (ctx,next)=>{
//     let {url} = ctx.query;
//     if(!url.startsWith('http://')||!url.startsWith('https://')) url = 'http://'+url;
//         // 插入数据库
//         console.log();
//           let newRecord =await new db.recordModel({url,from:ctx.headers.referer}).save();
//         console.log('record:',url);
//     await ctx.redirect(url);
// })
// .get('/local/:file',async(ctx,next)=>{
//     await  ctx.render('hsite/movie',{local:ctx.params.file});
// })
// .get('/movie/:file',async(ctx,next)=>{
//         let file= ctx.params.file;
//         console.log(file)
//         await ctx.render('hsite/movie',{movie:file});
// })
// .get('/video',async(ctx,next)=>{
//     let {title}=ctx.query;
//     console.log(title);
//     let video =await db.fuliMovieModel.findOne({title}).exec()
//     if(video){
//       await  ctx.render('hsite/movie',{url:'/uploads/'+video.video.filename})
//     }else{
//         console.log('error  no movie title found')
//     }
// })
// .get('/qrcode',async(ctx)=>{
//     await ctx.render('hsite/qrcode');
// })
// .get('/recordList',async(ctx,next)=>{
//     let {regexp} = ctx.query;
//     console.log(regexp)
//    let records=  await db.recordModel.find({url:new RegExp(regexp)}).exec();
//    ctx.body={ok:true,data:records} ;
// })
// .get('/bomb.images.json',async(ctx,next)=>{
//     let {bombId}= ctx.query;
//     console.log(bombId);
//     let images=await db.pictureModel.find({bomb:bombId}).exec();
//     ctx.body={ok:true,data:images};
// })
// .all('/client/:any',(ctx,next)=>{
//     ctx.res.setHeader('content-type','text/html');
//     ctx.body=clientHtml;
// })
// .get('/av/:prefix',async (ctx,next)=>{
//     let prefix = ctx.params.prefix;
//     let fuliVideo =await db.fuliMovieModel.findOne({title:prefix}).exec() ;
//     console.log(fuliVideo);
//     await ctx.render('hsite/av',{av:fuliVideo?fuliVideo.prefix:''});
// })
// export {homeRouter}; 
