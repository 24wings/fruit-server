"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let adminSchema = new mongoose.Schema({ phone: String, password: String, nickname: String });
exports.adminModel = mongoose.model('admin', adminSchema);
