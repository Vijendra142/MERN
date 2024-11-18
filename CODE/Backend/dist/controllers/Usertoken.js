"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const clearCookie = (res) => {
    // Assuming 'token' is the name of the cookie you want to clear
    res.clearCookie('token');
};
const verifytoken = (req, res, next) => {
    const token = req.cookies.token;
    const secret = "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxMDU3NTk3MywiaWF0IjoxNzEwNTc1OTczfQ.daq9weny70apNazg0M-4eVkB4fMab8ixcp_bHRZ7HME";
    if (!token) {
        return res.status(404).json({
            success: false,
            message: "Unauthorized: Login first"
        });
    }
    jsonwebtoken_1.default.verify(token, secret, (error, decoded) => {
        if (error) {
            console.log(error);
            clearCookie(res);
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Login first"
            });
        }
        else {
            req.userId = decoded.userId;
            next();
        }
    });
};
exports.default = verifytoken;
