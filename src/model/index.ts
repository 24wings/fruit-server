import mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/airuanjian');


// 通用
export { cloudinaryImageModel, CloudinaryImage } from './cloudinary-image';



// 管理系统
export { adminModel } from './manage/admin';


// 水果系统
export { fruitUserModel } from './app-fruit/fruit-user';
export { fruitSettingModel } from './app-fruit/fruit-setting';
export { fruitProductGroupModel } from './app-fruit/fruit-product-group';
export { fruitProductModel } from './app-fruit/fruit-product'
export { fruitOrderModel, FruitOrderState } from './app-fruit/fruit-order';
