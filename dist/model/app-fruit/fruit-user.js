"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let fruitUserSchema = new mongoose.Schema({
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
    nickname: String, phone: String, password: String
});
exports.fruitUserModel = mongoose.model('fruit-user', fruitUserSchema);
