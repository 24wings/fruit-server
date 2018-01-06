"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let fuliMovieSchema = new mongoose.Schema({
    title: String,
    prefix: String,
    video: { type: { filename: String, filesize: String, mimetype: String } }
});
exports.fuliMovieModel = mongoose.model('fulimovie', fuliMovieSchema);
