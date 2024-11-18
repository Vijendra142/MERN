"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Orders = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: 'User'
    },
    product: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "Product"
    },
    fullname: {
        type: String
    },
    email: {
        type: String
    },
    shippingAddress: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    shippingDate: {
        type: Date,
        default: Date.now
    },
    payment: {
        type: String,
        enum: ['online', 'cash_on_delivery'],
        required: true
    },
    Status: {
        type: String,
        default: "processing"
    },
    amount: {
        type: String
    },
    quantity: {
        type: Number
    }
});
let Order = mongoose_1.default.model('Orders', Orders);
exports.default = Order;
