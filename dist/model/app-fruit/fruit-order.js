"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
var FruitOrderState;
(function (FruitOrderState) {
    FruitOrderState[FruitOrderState["UnConfirm"] = 0] = "UnConfirm";
    FruitOrderState[FruitOrderState["SendProduct"] = 1] = "SendProduct";
    //  订单确认后取消的原因
    FruitOrderState[FruitOrderState["Cancel"] = 2] = "Cancel";
    // 从购物车中移除
    FruitOrderState[FruitOrderState["Remove"] = 3] = "Remove";
    FruitOrderState[FruitOrderState["Finish"] = 4] = "Finish";
})(FruitOrderState = exports.FruitOrderState || (exports.FruitOrderState = {}));
let fruitOrderSchema = new mongoose.Schema({
    createDt: { type: Date, default: Date.now },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'fruit-product' },
    orderUser: { type: mongoose.Schema.Types.ObjectId, ref: 'fruit-user', required: true },
    num: { type: Number, default: 0, required: true },
    state: { type: Number, default: FruitOrderState.UnConfirm },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'admin', required: true },
    cancelReason: { type: String, default: '' }
});
exports.fruitOrderModel = mongoose.model('fruit-order', fruitOrderSchema);
