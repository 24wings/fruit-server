"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let recordSchema = new mongoose.Schema({
    url: String,
    from: String,
    visitDt: { type: Date, default: Date.now }
});
exports.recordModel = mongoose.model('record', recordSchema);
