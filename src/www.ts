import path = require('path');
import koa = require('koa');
import serve = require('koa-static');
import bodyparser = require('koa-bodyparser');
import views = require('koa-views');
import routes = require('./route');
import session = require('koa-session');
let error = require('koa-handle-error');
var swig = require('swig');
swig.setDefaults({ cache: false });

let app = new koa();


const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
};
let server = app
  .use(async (ctx, next) => {
    //sads
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.set("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    ctx.set("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    ctx.set("X-Powered-By", ' 3.2.1')
    if (ctx.method == "OPTIONS") ctx.body = 200;
    /*让options请求快速返回*/
    else {
      await next();
    }
  });
app.keys = ['some secret hurr'];
app.use(session(CONFIG, app));
app
  .use(serve(path.resolve(__dirname, '../www')))
  // .use(serve(path.resolve(__dirname,'../../keystone-demo/public')))
  .use(bodyparser({ jsonLimit: '50mb', formLimit: '50mb' }))
  .use(views(path.resolve(__dirname, '../views'), { map: { html: 'swig' } }))
  .use(error((err) => console.error(err)));
for (let route in routes) {
  app.use(routes[route].allowedMethods());
  app.use(routes[route].routes());
}

server.listen(80, () => {
  console.log(`server is runing`);
});
// require('net')
//     .createServer( function(socket) 
//     {
//            // no nothing
//     })
//     .listen(21, function()
//      {
//            console.log('Socket ON')
//     })