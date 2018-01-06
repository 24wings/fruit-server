"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let bombSchema = new mongoose.Schema({
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
    title: String,
    createDt: { type: Date, default: Date.now },
    summary: { type: String },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
});
exports.bombModel = mongoose.model('bomb', bombSchema);
