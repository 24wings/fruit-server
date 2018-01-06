"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let movieCategorySchema = new mongoose.Schema({
    title: String,
    summary: String,
    createDt: Date,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' }
});
exports.movieCategoryModel = mongoose.model('MovieCategory', movieCategorySchema);
