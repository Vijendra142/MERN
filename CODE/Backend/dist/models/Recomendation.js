"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Recomendation = new mongoose_1.default.Schema({
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
    }
});
let Dashboard = mongoose_1.default.model('Recomendation', Recomendation);
exports.default = Dashboard;
