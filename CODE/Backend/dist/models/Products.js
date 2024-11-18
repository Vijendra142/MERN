"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Product = new mongoose_1.default.Schema({
    productname: {
        type: String,
    },
    description: {
        type: String
    },
    Originalprice: {
        type: Number
    },
    Price: {
        type: Number
    },
    category: {
        type: String,
        enum: {
            values: [
                'Electronics',
                'Clothing and Apparel',
                'Home and Kitchen',
                'Beauty and Personal Care',
                'Health and Wellness',
                'Books and Media',
                'Toys and Games',
                'Sports and Outdoors',
                'Food and Beverages',
                'Jewelry and Accessories',
                'Automotive',
                'Pets'
            ]
        }
    },
    stock: {
        type: Number
    },
    image: [{
            type: String
        }],
    createAt: {
        type: Date
    },
    review: [
        {
            user: {
                type: mongoose_1.default.SchemaTypes.ObjectId,
                ref: "User"
            },
            order: {
                type: mongoose_1.default.SchemaTypes.ObjectId,
                ref: "Orders"
            },
            rating: {
                type: Number,
                default: 0
            },
            Comment: {
                type: String
            },
            date: {
                type: Date
            }
        }
    ]
});
const ProductSchema = mongoose_1.default.model('Product', Product);
exports.default = ProductSchema;
