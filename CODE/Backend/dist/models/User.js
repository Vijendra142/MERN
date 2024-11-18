"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User = new mongoose_1.default.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    Avathar: {
        type: String
    },
    dates: {
        type: Date
    },
    otp: {
        type: Number
    },
    status: {
        type: String,
        enum: ['activate', 'inactivate']
    },
    cupon: [{
            type: mongoose_1.default.SchemaTypes.ObjectId,
            ref: "Cupon"
        }],
    stripeCustomerId: { type: String, required: false }
});
const Usemodel = mongoose_1.default.model('User', User);
exports.default = Usemodel;
