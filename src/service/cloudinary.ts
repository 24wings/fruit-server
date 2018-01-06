var cloudinary = require('cloudinary');
import path = require('path');
import fs = require('fs');
import { CloudinaryImage, cloudinaryImageModel } from '../model'
import db = require('../model');
let uploadDir = path.resolve(__dirname, '../../www/upload');
cloudinary.config({
    cloud_name: 'dnf1ydl7w',
    api_key: '688229757297621',
    api_secret: 'D-7VrFqtn6ayg6ItFNXSm52jcS0'
});
// See Configuration Options for more details and additional configuration methods.



export async function uploadImage(base64: string): Promise<CloudinaryImage> {
    return <any>new Promise(resolve => {
        cloudinary.v2.uploader.upload(base64,
            function (err, result) {
                if (err) console.log(err)
                resolve(result);

            });
    })

}

/** 讲base64图片上传,并返回数据 cloudinary 数据库对象 */
export async function storeImage(base64: string, adminId: string, appName: string) {
    let result = await uploadImage(base64);
    result.admin = adminId;
    result.appName = appName;
    return await new cloudinaryImageModel(result).save()
}

export async function storeImages(base64Arr: string[], adminId: string, appName: string): Promise<CloudinaryImage[]> {
    let imageItems: any[] = [];
    for (let base64 of base64Arr) {
        /** old image object */
        if (base64['_id']) {
            let imageItem = await db.cloudinaryImageModel.findById(base64['_id']).exec();
            imageItems.push(imageItem);
        } else {

            let imageItem = await storeImage(base64, adminId, appName);
            imageItems.push(imageItem);
        }
    }
    return <any>imageItems;
}
