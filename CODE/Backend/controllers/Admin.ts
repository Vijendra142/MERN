const express = require("express");
const { Request, Response, NextFunction } = require("express");
const Usemodel = require("../models/User");
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const ProductSchema = require("../models/Products");
const tokenverify = require("./Admintoken");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const { validate, Addproduct } = require('../Validation/Admin');
const CuponModel = require("../models/Cupon");
const { sendOrderStatusChange } = require("./Sendmail");

const router = express.Router();

// Admin login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        if (email === "admin@gmail.com" && password === "admin") {
            const token = jwt.sign({ email: email }, "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxMDU3NTk3MywiaWF0IjoxNzEwNTc1OTczfQ.daq9weny70apNazg0M-4eVkB4fMab8ixcp_bHRZ7HME", { expiresIn: "1hr" });
            res.cookie('token', token, {
                httpOnly: false
            });
            return res.status(200).json({
                success: true,
                message: "Successful login"
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Invalid credentials"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Dashboard count
router.get('/count', async (req, res, next) => {
    try {
        const users = await Usemodel.countDocuments();
        console.log(users, 'user count');
        const products = await ProductSchema.countDocuments();
        console.log(products, 'product count');
        const orders = await Order.countDocuments();
        console.log(orders, 'orders count');

        const user = await Usemodel.aggregate([
            { $group: { _id: { $month: "$dates" }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        console.log(user, 'users');
        const product = await ProductSchema.aggregate([
            { $group: { _id: { $month: "$createAt" }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        console.log(product, 'products');

        const order = await Order.aggregate([
            { $group: { _id: { $month: "$shippingDate" }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        console.log(order, 'orders');

        const sales = await Order.aggregate([
            { $match: { Status: 'delivery' } },
            { $group: { _id: null, count: { $sum: 1 } } }
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
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Multer storage and file filter setup
const storage = multer.diskStorage({
    destination: 'products',
    filename: (req, file, cb) => {
        const unnifixx = uuidv4();
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + "" + unnifixx + fileExtension);
    }
});

const filter = (req, file, cb) => {
    const allowType = ['image/jpeg', 'image/png'];
    if (allowType.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Product Image must be in jpeg or png format'));
    }
};

const upload = multer({ storage: storage, fileFilter: filter });

// Post product
router.post('/products', tokenverify, upload.array('image'), validate(Addproduct), async (req, res, next) => {
    try {
        const { productname, description, Originalprice, Price, category, stock } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        const images = req.files.map((file) => file.filename);

        const newProduct = await ProductSchema.create({
            productname: productname,
            description: description,
            Originalprice: Originalprice,
            Price: Price,
            category: category,
            stock: stock,
            createAt: Date.now(),
            image: images
        });
        console.log(newProduct);
        if (newProduct) {
            return res.status(201).json({
                success: true,
                message: "New product successfully added",
                Product: newProduct
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Get products
router.get('/products', tokenverify, async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const name = req.query.name;
    const category = req.query.category;
    const limit = 12;

    try {
        let match = {};

        if (name) {
            match.productname = { $regex: new RegExp(name, 'i') };
        }

        if (category) {
            match.category = { $regex: new RegExp(category, 'i') };
        }

        const totalProducts = await ProductSchema.countDocuments(match);
        const totalPages = Math.ceil(totalProducts / limit);

        const products = await ProductSchema.aggregate([
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
        } else {
            return res.status(200).json({
                success: true,
                totalPages: totalPages,
                currentPage: page,
                products: products
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Update product
router.put('/product/:id', tokenverify, upload.array('image'), async (req, res, next) => {
    const id = req.params.id;
    console.log(id);
    try {
        const product = await ProductSchema.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } }
        ]);
        console.log(product);
        const { productname, description, Originalprice, Price, category, stock } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        const images = req.files.map((file) => file.filename);

        const updateProduct = await ProductSchema.findByIdAndUpdate(id, {
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
                message: "Updated successfully"
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Something went wrong, try again later"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Delete product
router.delete('/product/:id', tokenverify, async (req, res, next) => {
    const id = req.params.id;
    try {
        const product = await ProductSchema.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "No product found with this ID"
            });
        }
        const productDelete = await ProductSchema.findByIdAndDelete(id);
        if (productDelete) {
            return res.status(200).json({
                success: true,
                message: "Product deleted successfully"
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Something went wrong, try again later"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Add coupon
router.post('/add-coupon', tokenverify, async (req, res, next) => {
    const { couponCode, discount, expiryDate } = req.body;

    try {
        const newCoupon = await CuponModel.create({
            couponCode: couponCode,
            discount: discount,
            expiryDate: expiryDate
        });

        return res.status(201).json({
            success: true,
            message: "Coupon created successfully",
            coupon: newCoupon
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Get orders
router.get('/orders', tokenverify, async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    try {
        const totalOrders = await Order.countDocuments();
        const totalPages = Math.ceil(totalOrders / limit);

        const orders = await Order.aggregate([
            { $sort: { _id: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit }
        ]);

        return res.status(200).json({
            success: true,
            totalPages: totalPages,
            currentPage: page,
            orders: orders
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Update order status
router.put('/orders/:id', tokenverify, async (req, res, next) => {
    const orderId = req.params.id;
    const { Status } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const updatedOrder = await Order.findByIdAndUpdate(orderId, {
            Status: Status
        }, { new: true });

        sendOrderStatusChange(order.user, updatedOrder.Status);

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            updatedOrder: updatedOrder
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

module.exports = router;
