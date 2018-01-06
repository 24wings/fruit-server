"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let movieSchema = new mongoose.Schema({
    title: String,
    video: { filename: String, filesize: Number, mimetype: String }
});
exports.movieModel = mongoose.model('movie', movieSchema);
