import mongoose = require('mongoose');


let fruitUserSchema = new mongoose.Schema({
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
    nickname: String, phone: String, password: String
});

export interface FruitUser extends mongoose.Document {
    admin: any;
    nickname: string;
    phone: string;
    password: string
}


export let fruitUserModel = mongoose.model('fruit-user', fruitUserSchema);