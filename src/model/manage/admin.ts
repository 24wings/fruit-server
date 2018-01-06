import mongoose = require('mongoose');

let adminSchema = new mongoose.Schema({ phone: String, password: String, nickname: String });

export interface Admin extends mongoose.Document {
    nickname: string;
    phone: string;
    password: string
}

export let adminModel = mongoose.model<Admin>('admin', adminSchema);
