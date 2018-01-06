"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let adminSchema = new mongoose.Schema({
    nickname: String,
    name: String,
    email: String,
    createDt: { type: Date, default: Date.now },
    canAccessKeystone: Boolean,
    avatar: { type: { public_id: String, version: String, signature: String, width: Number, height: Number, format: String, resource_type: String, url: String } }
    // keywords:{type:String,default:''}
});
exports.adminModel = mongoose.model('admin', adminSchema);
