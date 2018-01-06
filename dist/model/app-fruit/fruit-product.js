"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let fruitProductSchema = new mongoose.Schema({
    name: String,
    price: { type: Number },
    //库存
    store: { type: Number, default: 0 },
    images: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'cloudinary-image' }], ref: 'cloudinary-image', default: [] },
    createDt: { type: Date, default: Date.now },
    summary: { type: String, default: '' },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'fruit-group' },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
    isRecommand: { type: Boolean, default: false }
});
exports.fruitProductModel = mongoose.model('fruit-product', fruitProductSchema);
