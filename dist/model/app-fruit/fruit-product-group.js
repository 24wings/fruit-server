"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let fruitProductGroupSchema = new mongoose.Schema({
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
    name: String,
    image: { type: mongoose.Schema.Types.ObjectId, ref: 'cloudinary-image' },
    products: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'fruit-product' }], default: [] },
    isRecommand: { type: Boolean, default: false },
    createDt: { type: Date, default: Date.now }
});
exports.fruitProductGroupModel = mongoose.model('fruit-product-group', fruitProductGroupSchema);
