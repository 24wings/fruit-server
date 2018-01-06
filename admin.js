var keystone = require('keystone');

exports.getData = async function(req, res) {
    let now = new Date();
    let today = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0);
    let tomorrow=new Date(today.getTime()+24*60*60*1000);
    let records = await keystone.list('Record').model.find({createDt:{$gt:today,$lt:tomorrow }}).where().populate('orderUser shopKeeper product').exec();
    // let groups = [];
    // records.forEach(record=>{
    //    let hadGroup = groups.find(group=>group.orderUser);
    //    if(hadGroup)
    // });
    console.log(records);
    await res.render('data',{records});
};

exports.getHome = async (req,res)=>{
   let admin = req.session.admin;
   if(admin){
    await res.render('admin/index');
   }else{
    res.redirect('/admin/login');
}
}

// exports.getLogin=async (req,res)=>{
//     let admin =req.session.admin;
    
//     if(user){
//         res.redirect('/home')
//     }else{
        
//        await res.render('login');

//     }

// }

exports.login= async (req,res)=>{
    let {username,password}=req.body;
    console.log(username,password);
    let user = await keystone.list('User').model.findOne({username,password}).exec();
    console.log('exist',user);
    if(user){
        req.session.user=user;
        res.locals.user=user;
       await res.redirect('/');
    }else{
       await res.render('login',{error:'用户名或密码错误'})
    }
}