import mongoose = require('mongoose');

export enum FruitOrderState {
    UnConfirm,
    SendProduct,
    //  订单确认后取消的原因
    Cancel,
    // 从购物车中移除
    Remove,
    Finish




}
let fruitOrderSchema = new mongoose.Schema(
    {
        createDt: { type: Date, default: Date.now },
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'fruit-product' },
        orderUser: { type: mongoose.Schema.Types.ObjectId, ref: 'fruit-user', required: true },
        num: { type: Number, default: 0, required: true },
        state: { type: Number, default: FruitOrderState.UnConfirm },
        admin: { type: mongoose.Schema.Types.ObjectId, ref: 'admin', required: true },
        cancelReason: { type: String, default: '' }
    }
);

export interface FruitOrder extends mongoose.Document {
    createDt: Date;
    product: any;
    orderUser: any;
    state: Number;
    admin: any;
    num: number;

}

export let fruitOrderModel = mongoose.model<FruitOrder>('fruit-order', fruitOrderSchema);
