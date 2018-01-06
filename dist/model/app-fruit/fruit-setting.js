"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let fruitSettingSchema = new mongoose.Schema({ key: String, value: String, admin: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' } });
exports.fruitSettingModel = mongoose.model('fruit-setting', fruitSettingSchema);
