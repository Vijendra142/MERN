"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Cupon = new mongoose_1.default.Schema({
    code: {
        type: String
    },
    discountAmount: {
        type: String
    },
    Validity: {
        type: Date
    },
    Status: {
        type: Boolean,
        default: false
    }
});
let CuponModel = mongoose_1.default.model("Cupon", Cupon);
exports.default = CuponModel;
