import mongoose = require('mongoose');

let fruitSettingSchema = new mongoose.Schema({ key: String, value: String, admin: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' } });

export interface fruitSetting extends mongoose.Document { }

export let fruitSettingModel = mongoose.model('fruit-setting', fruitSettingSchema);