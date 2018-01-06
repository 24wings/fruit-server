var keystone = require('keystone');

exports.getData = async function (req, res) {
    let now = new Date();
    let today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0);
    let tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    let records = await keystone.list('Record').model.find({ createDt: { $gt: today, $lt: tomorrow } }).where().populate('orderUser shopKeeper product').exec();
    // let groups = [];
    // records.forEach(record=>{
    //    let hadGroup = groups.find(group=>group.orderUser);
    //    if(hadGroup)
    // });
    console.log(records);
    await res.render('data', { records });
};

exports.getHome = async (req, res) => {
    let user = req.session.user || res.locals.user;
    let categorys = await keystone.list('ProductCategory').model.find().exec();
    console.log('user:', user);
    if (user) {
        let recommandProducts = await keystone.list('RecommandProduct').model.find().populate('product').exec();
        console.log(recommandProducts);
        let recommandCategorys = await keystone.list('RecommandCategory').model.find().populate('category').exec();
        await res.render('home', { recommandProducts, recommandCategorys, categorys });

    } else {
        res.redirect('/login');
    }

}

exports.getLogin = async (req, res) => {
    let user = req.session.user;
    console.log(user);
    if (user) {
        res.redirect('/')
    } else {

        await res.render('login');

    }
}

exports.login = async (req, res) => {
    let { username, password } = req.body;
    console.log(username, password);
    let user = await keystone.list('User').model.findOne({ username, password }).exec();
    console.log('exist', user);
    if (user) {
        req.session.user = user;
        res.locals.user = user;
        await res.redirect('/');
    } else {
        await res.render('login', { error: '用户名或密码错误' })
    }
}
exports.getCategoryDetail = async (req, res) => {
    let categoryId = req.params._id;
    let category = await keystone.list('ProductCategory').model.findById(categoryId).exec();
    let categorys = await keystone.list('ProductCategory').model.find().exec();


    if (category) {
        let products = await keystone.list('Product').model.find({ productCategory: categoryId }).exec();


        await res.render('categoryDetail', { category, products, categorys, products });
    }


}
exports.getProductDetail = async (req, res) => {
    let productId = req.params._id;

    let categorys = await keystone.list('ProductCategory').model.find().exec();
    let product = await keystone.list('Product').model.findById(productId).populate('productCategory').exec();
    let category = product.productCategory;

    let products =[];
    let num=0;
    if(category){
        
        let user =req.session.user;
        if(user){
            let userId=user._id;
            let now = new Date();
            let today =new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0);
            let tomorry =new Date(today.getTime()+24*60*60*1000);    
            /* 查出用户是否有 **/
            if(userId){
               let record= await  keystone.list('Record').model.findOne({createDt:{$lt:tomorry,$gt:today},orderUser:userId,product:productId }).exec();
            if(record)  num =record.num;
            }
            products=await keystone.list('Product').model.find({ productCategory: category._id}).exec();
            await res.render('productDetail', { product, category, categorys, products ,num});
        } 
        else{
            res.redirect('/login')
        }

        }

}

exports.order = async (req, res) => {
    let { productId, productCount, userId } = req.body;
    console.log(productId, productCount, userId);
    let user = await keystone.list('User').model.findById(userId).exec();
    if (user) {
        let model = await keystone.list('Record');
        let now = new Date();
        let today =new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0);
        let tomorry =new Date(today.getTime()+24*60*60*1000);
        
        /* 查出用户是否有 **/
      
           let record= await  keystone.list('Record').model.findOne({createDt:{$lt:tomorry,$gt:today},orderUser:user._id,product:productId }).exec();
           console.log('record',record);
        if(record){ record.update({num:productCount,state:'未确认'}).exec();
        
    }
        else{
        
        model.model({ orderUser: user._id, product: productId, num: ~~productCount }).save();
       
       
    }
    let categorys = await keystone.list('ProductCategory').model.find().exec();
    let product = await keystone.list('Product').model.findById(productId).populate('productCategory').exec();
    let category = product.productCategory;
    let products=[];
    if(category){
     products= await keystone.list('Product').model.find({ productCategory: category._id }).exec();
    }
    // await res.render('', { product, category, categorys, products,num:productCount, success: `成功下订单${productCount}件` });
    res.redirect(`/user/${userId}/order`);
    } else {
        res.redirect('/login');
    }


}
exports.logout = async (req, res) => {
    req.session.user = undefined;
    res.locals.user = undefined;
    res.clearCookie('user');
    res.redirect('/');
}
exports.getUserRecord  = async (req,res)=>{
    let userId= req.params.userId;
    console.log('userId:',userId);
    let records = await keystone.list('Record').model.find({orderUser:userId}).populate('product orderUser').exec();
    let now = new Date();
    let today = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0);
   let oldRecords = records.filter(record=>record.createDt.getTime()<today.getTime());
   let todayRecords = records.filter(record=>record.createDt.getTime()>today.getTime());
    
    await res.render('order',{records,oldRecords,todayRecords});
}

exports.deleteUserRecordById= async(req,res)=>{
    let userId= req.params.userId;
    let recordId =req.params.recordId;
    let record = await keystone.list('Record').model.findById(recordId).exec();
    if(record ){
        if(record.orderUser==userId){
           await record.remove(); 
        }
    }
    res.redirect(`/user/${userId}/order`)

}

exports.confirmOrder= async(req,res)=>{
    let userId= req.params.userId;
    let recordId =req.params.recordId;
     await keystone.list('Record').model.findByIdAndUpdate(recordId,{state:'已确认'}).exec();
     res.redirect(`/user/${userId}/order`)
     
}
exports.listUsers  = async (req,res)=>{
        let users = await keystone.list('User').model.find().exec();
       await  res.render('users',{users});
}
exports.getQueryRecord= async(req,res)=>{
    await res.render('queryRecord');
}
exports.queryRecord= async(req,res)=>{

    let {time} = req.body;
    time = new Date(time);
    time.setHours(0);
    time.setMinutes(0);
    
    let nextDt=new Date(time.getTime()+24*60*60*1000);
    let records= await keystone.list('Record').model.find({createDt:{$lt:nextDt,$gt:time}}).populate('product orderUser').exec();
    await   res.json({ok:true,data:records});
}
exports.getUsers=async(req,res)=>{
    let users=await keystone.list('User').model.find().exec();
    res.json({ok:true,data:users});
}
exports.queryUserRecord=async(req,res)=>{
    let userId= req.query.userId;
    let time=parseInt(req.query.time);
    let records=[];
    if(time){
        console.log(time,typeof time);
    records =await keystone.list('Record').model.find({orderUser:userId,createDt:{$lt:new Date(time+24*60*60*1000),$gt:new Date(time)}}).populate('product orderUser').exec();
}else{
   records= await keystone.list('Record').model.find({orderUser:userId}).populate('product orderUser').exec();
}
    await res.json({ok:true,data:records});
}