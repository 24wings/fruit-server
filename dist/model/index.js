"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/airuanjian');
// 通用
var cloudinary_image_1 = require("./cloudinary-image");
exports.cloudinaryImageModel = cloudinary_image_1.cloudinaryImageModel;
// 管理系统
var admin_1 = require("./manage/admin");
exports.adminModel = admin_1.adminModel;
// 水果系统
var fruit_user_1 = require("./app-fruit/fruit-user");
exports.fruitUserModel = fruit_user_1.fruitUserModel;
var fruit_setting_1 = require("./app-fruit/fruit-setting");
exports.fruitSettingModel = fruit_setting_1.fruitSettingModel;
var fruit_product_group_1 = require("./app-fruit/fruit-product-group");
exports.fruitProductGroupModel = fruit_product_group_1.fruitProductGroupModel;
var fruit_product_1 = require("./app-fruit/fruit-product");
exports.fruitProductModel = fruit_product_1.fruitProductModel;
var fruit_order_1 = require("./app-fruit/fruit-order");
exports.fruitOrderModel = fruit_order_1.fruitOrderModel;
exports.FruitOrderState = fruit_order_1.FruitOrderState;
