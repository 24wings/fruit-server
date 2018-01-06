import mongoose = require('mongoose');

let fruitProductGroupSchema = new mongoose.Schema({
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
    name: String,
    image: { type: mongoose.Schema.Types.ObjectId, ref: 'cloudinary-image' },
    products: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'fruit-product' }], default: [] },
    isRecommand: { type: Boolean, default: false },
    createDt: { type: Date, default: Date.now }
});
export interface FruitProductGroup extends mongoose.Document {
    name: string;
    image: any;
    products: any[]
    isRecommand: boolean;
    createDt: Date;
}

export let fruitProductGroupModel = mongoose.model<FruitProductGroup>('fruit-product-group', fruitProductGroupSchema);