"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let pictureSchema = new mongoose.Schema({
    bomb: { type: mongoose.Schema.Types.ObjectId, ref: 'bomb' },
    title: String,
    createDt: { type: Date, default: Date.now },
    summary: { type: String },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
    image: { type: { public_id: String, version: String, signature: String, width: Number, height: Number, format: String, resource_type: String, url: String } }
});
exports.pictureModel = mongoose.model('picture', pictureSchema);
