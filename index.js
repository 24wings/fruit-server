var keystone = require('keystone'),
    middleware = require('./middleware'),
    importRoutes = keystone.importer(__dirname); //generate 

// common  middleware
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);


// 404 Error Handle
keystone.set('404', function (err, req, res, next) {
    var title, message;
    if (err instanceof Error) {
        message = err.message;
        err = err.stack;
    }
    res.err(err, title, message);
});


// load routes 
var routes = {
    views: importRoutes('./views')
};

exports = module.exports = function (app) {
    app.use('/', async (req, res, next) => {
        res.locals.user = req.session.user || res.locals.user;
        await next();
    })
    app.get('/data', routes.views.data.getData);
    app.get('/', routes.views.data.getHome);
    app.get('/login', routes.views.data.getLogin);
    app.get('/category/:_id', routes.views.data.getCategoryDetail);
    app.get('/product/:_id', routes.views.data.getProductDetail);


    app.post('/login', routes.views.data.login);
    app.get('/admin', routes.views.admin.getHome);
    app.post('/order', routes.views.data.order);
    app.get('/logout', routes.views.data.logout);
    app.get('/user/:userId/order', routes.views.data.getUserRecord);
    app.get('/user/:userId/deleteOrder/:recordId', routes.views.data.deleteUserRecordById);
    app.get('/user/:userId/orderConfirm/:recordId',routes.views.data.confirmOrder);
    app.get('/queryRecord',routes.views.data.getQueryRecord);
    app.post('/queryRecord',routes.views.data.queryRecord);
    app.post('/toExcel',routes.views.excel.toExcel);
    app.get('/getUsers',routes.views.data.getUsers);
    app.get('/queryUserRecord',routes.views.data.queryUserRecord);
};
