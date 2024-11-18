"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const carts = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "User"
    },
    product: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "Product"
    },
    date: {
        type: Date
    },
    quantity: {
        type: Number,
        default: 1
    }
});
let Cartproduct = mongoose_1.default.model('carts', carts);
exports.default = Cartproduct;
