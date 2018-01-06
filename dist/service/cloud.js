"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var cloudinary = require('cloudinary');
const path = require("path");
let uploadDir = path.resolve(__dirname, '../../www/upload');
cloudinary.config({
    cloud_name: 'dnf1ydl7w',
    api_key: '688229757297621',
    api_secret: 'D-7VrFqtn6ayg6ItFNXSm52jcS0'
});
// See Configuration Options for more details and additional configuration methods.
function uploadImage(base64) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            cloudinary.v2.uploader.upload(base64, function (err, result) {
                if (err)
                    console.log(err);
                resolve(result);
            });
        });
    });
}
exports.uploadImage = uploadImage;
