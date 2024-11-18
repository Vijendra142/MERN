"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const Admin_1 = __importDefault(require("./controllers/Admin"));
const User_1 = __importDefault(require("./controllers/User"));
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || "6800");
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || "*", // Allow requests from all origins
    credentials: true, // Allow credentials (e.g., cookies, authorization headers)
    allowedHeaders: ["Authorization", "Content-Type"],
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use("/products", express_1.default.static("products"));
app.use("/users", express_1.default.static("users"));
mongoose_1.default
    .connect(process.env.DB_URL || "mongodb://localhost:27017/ecom")
    .then(() => {
    console.log("mongodb is connected");
    app.listen(PORT, () => {
        console.log(`server is running the ${PORT}`);
    });
});
app.use("/admin", Admin_1.default);
app.use("/user", User_1.default);
