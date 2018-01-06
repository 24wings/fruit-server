import mongoose = require('mongoose');
/**
 * {"ok":true,
 * "data":{
 * "public_id":"hlodri3gts1w7tgpd9rl",
 * "version":1514545545,
 * "signature":"d31ec1f4f4f71ff9fe095350f4919aa53d0ff721",
 * "width":5,
 * "height":5,
 * "format":"png",
 * "resource_type":"image",
 * "created_at":"2017-12-29T11:05:45Z",
 * "tags":[],
 * "bytes":85,
 * "type":"upload",
 * "etag":"b60ab2708daec7685f3d412a5e05191a",
 * "placeholder":false,
 * "url":"http://res.cloudinary.com/dnf1ydl7w/image/upload/v1514545545/hlodri3gts1w7tgpd9rl.png",
 * "secure_url":"https://res.cloudinary.com/dnf1ydl7w/image/upload/v1514545545/hlodri3gts1w7tgpd9rl.png"
 * }}
 */
let cloudinaryImageSchema = new mongoose.Schema({
    public_id: String,
    version: Number,
    signature: String,
    width: Number,
    format: String,
    resource_type: String,
    created_at: Date,
    tags: [String],
    bytes: Number,
    type: String,
    egtag: String,
    placeholder: Boolean,
    url: String,
    secure_url: String,
    appName: String,
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' }
});



export interface CloudinaryImage extends mongoose.Document {
    public_id: string;
    version: number;
    signature: string
    width: number,
    format: string,
    resource_type: string,
    created_at: Date,
    tags: string[],
    bytes: number,
    type: string,
    egtag: string,
    placeholder: boolean,
    url: string,
    secure_url: string,
    appName: string,
    admin: any;
}
export let cloudinaryImageModel = mongoose.model<CloudinaryImage>('cloudinary-image', cloudinaryImageSchema);


