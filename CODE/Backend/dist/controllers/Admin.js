"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const Products_1 = __importDefault(require("../models/Products"));
const Admintoken_1 = __importDefault(require("./Admintoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const Order_1 = __importDefault(require("../models/Order"));
const { validate, Addproduct } = require('../Validation/Admin');
const Cupon_1 = __importDefault(require("../models/Cupon"));
const Sendmail_1 = require("./Sendmail");
//admin login
router.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (email === "admin@gmail.com" && password === "admin") {
            const token = jsonwebtoken_1.default.sign({ email: email }, "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxMDU3NTk3MywiaWF0IjoxNzEwNTc1OTczfQ.daq9weny70apNazg0M-4eVkB4fMab8ixcp_bHRZ7HME", { expiresIn: "1hr" });
            res.cookie('token', token, {
                httpOnly: false
            });
            return res.status(200).json({
                success: true,
                message: "successfull login"
            });
        }
        else {
            return res.status(404).json({
                success: false,
                message: "invalid credential"
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    }
}));
//dash board1
router.get('/count', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.countDocuments();
        console.log(users, 'user count');
        const products = yield Products_1.default.countDocuments();
        console.log(products, 'product count');
        const orders = yield Order_1.default.countDocuments();
        console.log(orders, 'orders count');
        const user = yield User_1.default.aggregate([
            {
                $group: {
                    _id: { $month: "$dates" },
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);
        console.log(user, 'users');
        const product = yield Products_1.default.aggregate([
            {
                $group: {
                    _id: { $month: "$createAt" },
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);
        console.log(product, 'product');
        const order = yield Order_1.default.aggregate([
            {
                $group: {
                    _id: { $month: "$shippingDate" },
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);
        console.log(order, 'orders');
        const sales = yield Order_1.default.aggregate([
            {
                $match: {
                    Status: 'delivery' // Match orders with the status 'delivery'
                }
            },
            {
                $group: {
                    _id: null, // Group all documents together
                    count: { $sum: 1 } // Count the number of documents in each group
                }
            }
        ]);
        console.log(sales, 'sales');
        return res.status(200).json({
            success: true,
            users: users,
            products: products,
            orders: orders,
            user: user,
            product: product,
            order: order
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    }
}));
const storage = multer_1.default.diskStorage({
    destination: 'products',
    filename: (req, file, cb) => {
        const unnifixx = (0, uuid_1.v4)();
        const fileextension = path_1.default.extname(file.originalname);
        cb(null, file.fieldname + "" + unnifixx + fileextension);
    }
});
const filter = (req, file, cb) => {
    const AllowType = ['image/jpeg', 'image/png'];
    if (AllowType.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Product Image is jpeg or png formate'));
    }
};
const upload = (0, multer_1.default)({ storage: storage, fileFilter: filter });
//post product
router.post('/products', Admintoken_1.default, upload.array('image'), validate(Addproduct), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productname, description, Originalprice, Price, category, stock } = req.body;
        // if(Originalprice <  Price ){
        //     return res.status(400).json({
        //         success:false,
        //         message:"Price is always lessthan the Original Price"
        //     })
        // }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "image is required"
            });
        }
        const images = req.files.map((file) => file.filename);
        const NewProduct = yield Products_1.default.create({
            productname: productname,
            description: description,
            Originalprice: Originalprice,
            Price: Price,
            category: category,
            stock: stock,
            createAt: Date.now(),
            image: images
        });
        console.log(NewProduct);
        if (NewProduct) {
            return res.status(201).json({
                success: true,
                message: "New product Successfull Added",
                Product: NewProduct
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: "invalid credentials "
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    }
}));
//get the products
router.get('/products', Admintoken_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const name = req.query.name;
    const category = req.query.category;
    const limit = 12;
    try {
        let match = {};
        // Check if name is provided
        if (name) {
            match.productname = { $regex: new RegExp(name, 'i') }; // Case-insensitive regex search
        }
        // Check if category is provided
        if (category) {
            match.category = { $regex: new RegExp(category, 'i') }; // Case-insensitive regex search
        }
        const totalproducts = yield Products_1.default.countDocuments(match);
        const totalpage = Math.ceil(totalproducts / limit);
        const products = yield Products_1.default.aggregate([
            { $match: match },
            { $sort: { productname: 1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit }
        ]);
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found"
            });
        }
        else {
            return res.status(200).json({
                success: true,
                totalpage: totalpage,
                currentpage: page,
                products: products
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}));
//update the product 
router.put('/product/:id', Admintoken_1.default, upload.array('image'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    console.log(id);
    try {
        const product = yield Products_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(id)
                }
            }
        ]);
        console.log(product);
        const { productname, description, Originalprice, Price, category, stock } = req.body;
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "image is required"
            });
        }
        // Ensure req.files is of type Express.Multer.File[]
        const images = req.files.map((file) => file.filename);
        const updateProduct = yield Products_1.default.findByIdAndUpdate(id, {
            productname: productname,
            description: description,
            Originalprice: Originalprice,
            Price: Price,
            category: category,
            stock: stock,
            createAt: Date.now(),
            image: images
        });
        if (updateProduct) {
            return res.status(201).json({
                success: true,
                message: "update successfully"
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: "some went wroung try after some time"
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    }
}));
//delete the product
router.delete('/product/:id', Admintoken_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const product = yield Products_1.default.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "no product found with this id"
            });
        }
        const Productdelete = yield Products_1.default.findByIdAndDelete(id);
        if (Productdelete) {
            return res.status(200).json({
                success: true,
                message: "product delete sucessfully"
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: "some went wroung try after sometime"
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    }
}));
//get the order 
router.get('/orders', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.query.status;
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;
    try {
        const orders = yield Order_1.default.aggregate([
            {
                $match: {
                    Status: status // Assuming 'status' is a variable containing the status value
                }
            },
            {
                $lookup: {
                    from: Products_1.default.collection.name,
                    localField: "product",
                    foreignField: '_id',
                    as: "products"
                }
            },
            {
                $limit: limit
            },
            {
                $skip: skip
            }
        ]);
        if (orders.length == 0) {
            return res.status(404).json({
                success: false,
                message: "no orders found"
            });
        }
        else {
            return res.status(200).json({
                success: true,
                message: "orders",
                orders: orders
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    }
}));
//update the order
router.put('/update/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id; // No need to cast req.params.id again as it's already a string
    try {
        const order = yield Order_1.default.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "No order found"
            });
        }
        else {
            const status = req.body.status; // No need to cast req.body.status again as it's already a string
            const update = yield Order_1.default.findByIdAndUpdate(id, {
                Status: status
            });
            console.log(update);
            if (update) {
                const user = yield User_1.default.findById(order.user);
                const products = yield Products_1.default.findById(order.product);
                console.log(products, "products");
                const email = user === null || user === void 0 ? void 0 : user.email;
                const product = {
                    productname: (products === null || products === void 0 ? void 0 : products.productname) || '',
                    Price: (products === null || products === void 0 ? void 0 : products.Price) || 0,
                    Status: status || ''
                };
                (0, Sendmail_1.sendOrderStatusChange)(email, product);
                return res.status(201).json({
                    success: true,
                    message: "Order updated successfully"
                });
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: "Something went wrong, please try again later"
                });
            }
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}));
//add cuponen code 
router.post('/cupon', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code, discountAmount, Validity } = req.body;
        const cuponcode = yield Cupon_1.default.findOne({ code: code, Status: false });
        console.log(cuponcode);
        if (cuponcode) {
            return res.status(400).json({
                success: false,
                messsage: "cupon code already here"
            });
        }
        else {
            const newcupon = yield Cupon_1.default.create({
                code: code,
                discountAmount: discountAmount,
                Validity: Validity
            });
            if (newcupon) {
                return res.status(201).json({
                    success: true,
                    message: "Cupon Code Added Success",
                    newcupon: newcupon
                });
            }
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}));
//get cupon code
router.get('/cupon', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cupon = yield Cupon_1.default.find({ Status: false });
        if (cupon.length === 0) {
            return res.status(404).json({
                success: false,
                message: "no cupon code found"
            });
        }
        else {
            return res.status(200).json({
                success: true,
                message: "cupon code",
                cupon: cupon
            });
        }
    }
    catch (error) {
        console.log(error);
    }
}));
//view  Users
router.get('/users', Admintoken_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limilt = 7;
    try {
        const Users = yield User_1.default.aggregate([
            {
                $sort: { name: 1 }
            },
            {
                $skip: (page - 1) * limilt
            },
            { $limit: limilt }
        ]);
        if (Users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "no users Found"
            });
        }
        else {
            return res.status(200).json({
                success: true,
                message: "Users",
                Customers: Users
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    }
}));
router.put('/user/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const user = yield User_1.default.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No user found"
            });
        }
        const { cuponcode } = req.body;
        const cupon = yield Cupon_1.default.findOne({ code: cuponcode });
        if (!cupon) {
            return res.status(404).json({
                success: false,
                message: "No coupon code found"
            });
        }
        user.cupon.push(cupon._id);
        yield user.save();
        return res.status(200).json({
            success: true,
            message: "Coupon applied successfully"
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}));
// logout
router.get('/logout', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('token');
    return res.status(200).json({
        success: true,
        message: "logout success"
    });
}));
exports.default = router;
