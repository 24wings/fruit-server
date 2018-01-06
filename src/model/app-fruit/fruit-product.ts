import mongoose = require('mongoose');

let fruitProductSchema = new mongoose.Schema({
    name: String,
    price: { type: Number },
    //库存
    store: { type: Number, default: 0 },
    images: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'cloudinary-image' }], ref: 'cloudinary-image', default: [] },
    createDt: { type: Date, default: Date.now },
    summary: { type: String, default: '' },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'fruit-group' },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
    isRecommand:{type:Boolean,default:false}
});

interface FruitProduct extends mongoose.Document {
    name: string;
    price: number;
    images: any[];
    summary: string;
    store: number;
    group: any;
    isRecommand:boolean;
}

export let fruitProductModel = mongoose.model<FruitProduct>('fruit-product', fruitProductSchema);
