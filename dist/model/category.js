"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let categorySchema = new mongoose.Schema({
    title: String,
    summary: { type: String, default: '' },
    createDt: { type: Date, default: Date.now },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' }
});
exports.categoryModel = mongoose.model('category', categorySchema);
