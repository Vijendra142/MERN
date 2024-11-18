"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenverify = (req, res, next) => {
    const token = req.cookies.token;
    const secret = "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxMDU3NTk3MywiaWF0IjoxNzEwNTc1OTczfQ.daq9weny70apNazg0M-4eVkB4fMab8ixcp_bHRZ7HME";
    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Unauthorized: Login first"
        });
    }
    jsonwebtoken_1.default.verify(token, secret, (error, decoded) => {
        if (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Invalid token or secret key"
            });
        }
        else {
            req.body.decoded = decoded;
            next();
        }
    });
};
exports.default = tokenverify;
