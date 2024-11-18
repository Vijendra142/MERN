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
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const Usertoken_1 = __importDefault(require("./Usertoken"));
const Products_1 = __importDefault(require("../models/Products"));
// import stripe from 'stripe';
const Order_1 = __importDefault(require("../models/Order"));
const Sendmail_1 = require("./Sendmail");
const mongoose_1 = __importDefault(require("mongoose"));
const Recomendation_1 = __importDefault(require("../models/Recomendation"));
const Cart_1 = __importDefault(require("../models/Cart"));
const Cupon_1 = __importDefault(require("../models/Cupon"));
const { validate, register, login } = require('../Validation/Customer');
const storage = multer_1.default.diskStorage({
    destination: 'users',
    filename: (req, file, cb) => {
        const unisuffix = (0, uuid_1.v4)();
        const fileextension = path_1.default.extname(file.originalname);
        cb(null, file.fieldname + '-' + unisuffix + fileextension);
    }
});
const filter = (req, file, cb) => {
    const AllowType = ['image/jpg', 'image/png'];
    if (AllowType.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Avathar file is only jpge or png type '));
    }
};
const upload = (0, multer_1.default)({ storage: storage });
const registerotp = () => {
    const otp = Math.floor(Math.random() * 10000);
    return otp.toString().padStart(4, '0');
};
//user register
router.post('/register', upload.single('Avathar'), validate(register), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, email, password } = req.body;
        // Check if user already exists with the provided email
        const user = yield User_1.default.findOne({ email: email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }
        const otp = registerotp();
        // Create a new user
        const newUser = yield User_1.default.create({
            name: name,
            email: email,
            password: password,
            Avathar: (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename,
            otp: otp,
            status: 'inactivate',
            dates: Date.now()
        });
        // Send response
        if (newUser) {
            (0, Sendmail_1.sendotpregister)(email || '', otp);
            return res.status(201).json({
                success: true,
                message: "registered successfully",
                user: newUser
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
// verify otp
router.post('/verify-otp', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        const user = yield User_1.default.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No user found"
            });
        }
        else {
            const verifyotp = yield User_1.default.findOne({ email: email, otp: otp, status: 'inactivate' });
            if (verifyotp) {
                yield User_1.default.findOneAndUpdate({ email: email }, {
                    status: 'activate'
                });
                return res.status(200).json({
                    success: true,
                    message: "Otp verification completed"
                });
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: "Incorrect otp"
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
// resend otp 
router.post('/resend-otp', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield User_1.default.findOne({ email: email, status: 'inactivate' });
        const otp = registerotp();
        if (user) {
            const updateopt = yield User_1.default.findOneAndUpdate({ email: email }, {
                otp: otp
            });
            if (updateopt) {
                (0, Sendmail_1.sendotpregister)(email, otp);
                return res.status(200).json({
                    success: true,
                    message: "Otp resend successfully"
                });
            }
        }
        else {
            return res.status(404).json({
                success: false,
                message: "No user found"
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
//user login
router.post('/login', validate(login), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const users = yield User_1.default.findOne({ email: email, password: password, status: 'activate' });
        if (!users) {
            return res.status(404).json({
                success: false,
                message: "no user found"
            });
        }
        else {
            console.log(users);
            const userId = users._id;
            const token = jsonwebtoken_1.default.sign({ userId: userId }, 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxMDU3NTk3MywiaWF0IjoxNzEwNTc1OTczfQ.daq9weny70apNazg0M-4eVkB4fMab8ixcp_bHRZ7HME', { expiresIn: '1hr' });
            res.cookie('token', token, {
                httpOnly: false
            });
            return res.status(200).json({
                success: true,
                message: "successfully login",
                user: users
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
//recomedation 
router.get('/recomedation/:userid', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.params.userid;
    try {
        const customer = yield User_1.default.findById(userid);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "no Customer found"
            });
        }
        const product = yield Recomendation_1.default.aggregate([
            {
                $match: {
                    user: new mongoose_1.default.Types.ObjectId(userid)
                }
            },
            {
                $sort: {
                    date: -1
                }
            },
            {
                $limit: 8
            }
        ]);
        // console.log(product,'product')
        const productid = product.map((item) => {
            return item.product;
        });
        console.log(productid, 'productid');
        const products = yield Products_1.default.aggregate([
            {
                $match: {
                    _id: { $in: productid.map((id) => new mongoose_1.default.Types.ObjectId(id)) }
                }
            },
            {
                $addFields: {
                    tempIndex: { $indexOfArray: [productid.map((id) => id.toString()), "$_id"] }
                }
            },
            {
                $sort: {
                    tempIndex: -1 // Sort based on the temporary index field
                }
            }
        ]);
        // console.log(products,'product')
        return res.status(200).json({
            success: true,
            product: products
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
//section -b get the products
router.get('/products/:id', Usertoken_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    try {
        const customers = yield User_1.default.findById(id);
        if (!customers) {
            return res.status(404).json({
                success: false,
                message: "no customer found"
            });
        }
        const totalproducts = yield Products_1.default.countDocuments();
        const totalpage = Math.ceil(totalproducts / limit);
        const products = yield Products_1.default.aggregate([
            {
                $sort: { productname: 1 }
            },
            {
                $skip: (page - 1) * limit
            },
            {
                $limit: limit
            }
        ]);
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "no products found"
            });
        }
        else {
            return res.status(200).json({
                success: true,
                totalpage: totalpage,
                currentpage: page,
                products: products,
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
//search the product
router.get('/queryproduct/:userId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const page = parseInt(req.query.page, 10) || 1; // Parse the page parameter from query string
    const limit = 12; // Number of products per page
    const skip = (page - 1) * limit;
    try {
        // Check if the user exists
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No user found with the ID"
            });
        }
        // Destructure query parameters
        const { productname, minprice, maxprice, category } = req.query;
        // Construct query object based on provided query parameters
        const query = {};
        if (productname) {
            query.productname = { $regex: productname, $options: 'i' }; // Case-insensitive search for product name
        }
        if (minprice !== undefined) {
            query.price = Object.assign(Object.assign({}, query.Price), { $gte: minprice }); // Find products with price greater than or equal to minprice
        }
        if (maxprice !== undefined) {
            query.price = Object.assign(Object.assign({}, query.Price), { $lte: maxprice }); // Find products with price less than or equal to maxprice
        }
        if (category) {
            query.category = { $eq: category }; // Find products with specified category
        }
        // Find products based on the constructed query
        const products = yield Products_1.default.find(query).skip(skip).limit(limit);
        if (products.length === 0) {
            return res.status(404).json({
                success: true,
                message: "no products found"
            });
        }
        else {
            return res.status(200).json({
                success: true,
                data: products
            });
        }
        // Return the found products
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}));
//ger the product details
// router.get('/product/:userid/:productid',verifytoken,async(req:Request,res:Response,next:NextFunction)=>{
//     const userid : string = req.params.userid as string;
//     const productid : string = req.params.productid as string;
//     try{
//         const customer = await Usemodel.findById(userid);
//         if(!customer){
//             return res.status(404).json({
//                 success:false,
//                 message:"No Customer Found"
//             })
//         }
//         const product = await ProductSchema.aggregate([
//             {
//                 $match:{
//                     _id:new mongoose.Types.ObjectId(productid)
//                 }
//             },
//             {
//                 $lookup:{
//                     from:Usemodel.collection.name,
//                     localField:"review.user",
//                     foreignField:"_id",
//                     as : 'users'
//                 }
//             }
//         ]);
//         if(!product){
//             return res.status(404).json({
//                 success:false,
//                 message:"No Product Found "
//             })
//         }
//        // console.log(product)
//         const match = product.productname
//         console.log(match)
//          const products = await ProductSchema.aggregate([
//             {
//                 $match:{
//                     productname:match
//                 }
//             },
//             {
//                 $limit:4
//             }
//          ])
//          const recomend = await Dashboard.create({
//             user:userid,
//             product:productid,
//             date:Date.now()
//          })
//         console.log(recomend)
//         return res.status(200).json({
//             success:true,
//             message:"Products",
//             product:product,
//             moodeproducts:products,
//            recomend :recomend
//         })
//     }catch(error){
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             message:"internal server error"
//         })
//     }
// })
router.get('/product/:userid/:productid', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.params.userid;
    const productid = req.params.productid;
    try {
        const customer = yield User_1.default.findById(userid);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "No Customer Found"
            });
        }
        const product = yield Products_1.default.aggregate([
            {
                $match: { _id: new mongoose_1.default.Types.ObjectId(productid) }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "review.user",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $project: {
                    _id: 1,
                    productname: 1,
                    description: 1,
                    Originalprice: 1,
                    Price: 1,
                    category: 1,
                    stock: 1,
                    image: 1,
                    createAt: 1,
                    recommendation: 1,
                    review: {
                        $map: {
                            input: "$review",
                            as: "reviewItem",
                            in: {
                                user: "$$reviewItem.user",
                                rating: "$$reviewItem.rating",
                                Comment: "$$reviewItem.Comment",
                                date: "$$reviewItem.date",
                                userDetails: {
                                    $arrayElemAt: [
                                        "$userDetails",
                                        { $indexOfArray: ["$userDetails._id", "$$reviewItem.user"] }
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        ]);
        if (!product || product.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Product Found"
            });
        }
        const match = product[0].productname; // Accessing the productname from the first element of the product array
        const products = yield Products_1.default.aggregate([
            {
                $match: {
                    productname: match
                }
            },
            {
                $limit: 4
            }
        ]);
        const recomend = yield Recomendation_1.default.create({
            user: userid,
            product: productid,
            date: Date.now()
        });
        console.log(recomend);
        return res.status(200).json({
            success: true,
            message: "Products",
            product: product,
            moodeproducts: products,
            recomend: recomend
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
//section c order 
//post ot cart page
router.post('/cartproduct/:userid/:productid', Usertoken_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.params.userid;
    const productid = req.params.productid;
    try {
        const cartpage = yield Cart_1.default.findOne({ user: userid, product: productid });
        if (cartpage) {
            return res.status(400).json({
                success: false,
                message: "Product Already in cart "
            });
        }
        const newcart = yield Cart_1.default.create({
            user: userid,
            product: productid,
            date: Date.now()
        });
        if (newcart) {
            return res.status(201).json({
                success: true,
                message: "Product Added",
                newcart: newcart
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
//get the cart product
router.get('/cart/:userid', Usertoken_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.params.userid;
    try {
        const customer = yield User_1.default.findById(userid);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "internal server error"
            });
        }
        const product = yield Cart_1.default.find({ user: userid });
        console.log(product);
        const productid = product.map((item) => item.product);
        console.log(productid);
        const products = yield Products_1.default.find({ _id: productid });
        console.log(products);
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "no product found in your cart"
            });
        }
        else {
            return res.status(200).json({
                success: true,
                products: products,
            });
        }
    }
    catch (error) {
        console.log(error);
    }
}));
//update the cart 
router.put('/cart/:userid/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const userid = req.params.userid;
    try {
        const Product = yield Cart_1.default.findOne({ _id: id, user: userid });
        if (!Product) {
            return res.status(404).json({
                success: false,
                message: "No product found"
            });
        }
        else {
            const quantity = req.body.quantity; // Extracting quantity from req.body
            const update = yield Cart_1.default.findByIdAndUpdate(id, { quantity: quantity }, { new: true }); // Using findByIdAndUpdate to update the document
            console.log(update);
            if (update) {
                return res.status(200).json({
                    success: true,
                    message: "Update success"
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
router.get('/carts/:userid', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.params.userid;
    try {
        const customer = yield User_1.default.findById(userid);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "internal server error"
            });
        }
        // Find products in the user's cart
        const cartProducts = yield Cart_1.default.find({ user: userid });
        // Extract product ids from cart products
        const productIds = cartProducts.map((item) => item.product);
        // Aggregate to get all products with details from ProductSchema collection
        const aggregatedProducts = yield Cart_1.default.aggregate([
            {
                $match: { user: new mongoose_1.default.Types.ObjectId(userid) }
            },
            {
                $lookup: {
                    from: Products_1.default.collection.name, // Collection name
                    localField: "product",
                    foreignField: "_id",
                    as: "productDetails"
                }
            }
        ]);
        if (aggregatedProducts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "no product found in your cart"
            });
        }
        else {
            return res.status(200).json({
                success: true,
                products: aggregatedProducts
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
//delete the cart product
router.delete('/cart/:userid/:productid', Usertoken_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.params.userid;
    const productid = req.params.productid;
    try {
        const cartpage = yield Cart_1.default.findOne({ user: userid, _id: productid });
        if (!cartpage) {
            return res.status(400).json({
                success: false,
                message: "Product Already in cart "
            });
        }
        else {
            const productdelete = yield Cart_1.default.findByIdAndDelete(productid);
            if (productdelete) {
                return res.status(200).json({
                    success: false,
                    message: "product removed success"
                });
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}));
router.post('/apply/:userid', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.userid; // corrected variable name
    try {
        console.log(User_1.default); // corrected variable name
        const User = yield User_1.default.findById(id); // corrected variable name
        if (!User) {
            return res.status(404).json({
                success: false,
                message: "No user found"
            });
        }
        const { cupon } = req.body; // removed redundant cupon property access
        console.log(cupon, "post cuppon");
        const Cuponcode = yield User_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: Cupon_1.default.collection.name,
                    localField: "cupon",
                    foreignField: "_id",
                    as: "cupon" // corrected variable name
                }
            },
            {
                $match: {
                    'cupon.code': cupon // Filter documents where 'cupon.code' matches the provided 'cupon'
                }
            }
        ]);
        console.log(Cuponcode);
        return res.status(200).json({
            success: true,
            Cuponcode
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
const stripeSecretKey = "sk_test_51OWuXGSIUrd5GMmRru3QrMorMNdDBzOhh5LAWmuQCehA31Z2GmrkRvmAa8vZz7hlWMoeRNOq8liiQmC9TAQMnCz500V5cOMbRU";
const stripe = require('stripe')(stripeSecretKey);
router.post('/order/:userid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.params.userid;
    try {
        const user = yield User_1.default.findById(userid);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No user found with this id"
            });
        }
        const orders = yield Cart_1.default.find({ user: userid });
        console.log(orders);
        // Extract product IDs from orders
        const productIds = orders.map(order => order.product);
        // Find products based on the extracted product IDs
        const products = yield Products_1.default.find({ _id: { $in: productIds } });
        // Process orders
        for (const order of orders) {
            const { shippingAddress, fullname, email, city, state, postalCode, country, phoneNumber, payment, cuponid } = req.body;
            // Calculate quantity and amount
            const product = products.find(product => product._id.equals(order.product));
            const quantity = order.quantity;
            const amount = product && product.Price ? product.Price * quantity : 0;
            // Choose payment method
            if (payment === "online") {
                // Create payment intent with customer ID
                const paymentIntent = yield stripe.paymentIntents.create({
                    amount: amount * 100,
                    currency: 'USD',
                    payment_method_types: ['card'],
                    payment_method: "pm_card_visa",
                    customer: user.stripeCustomerId // Assuming you have the Stripe customer ID saved in your user model
                });
                console.log(paymentIntent);
                if (paymentIntent.status !== 'requires_confirmation') {
                    return res.status(500).json({
                        success: false,
                        message: 'Error processing payment',
                    });
                }
                if (product && typeof product.stock === 'number') {
                    product.stock -= quantity;
                    yield product.save();
                }
                else {
                    console.warn('Product stock is not a valid number');
                }
            }
            else if (payment === 'cash_on_delivery') {
                // Decrease product stock
                if (product && typeof product.stock === 'number') {
                    product.stock -= quantity;
                    yield product.save();
                }
                else {
                    console.warn('Product stock is not a valid number');
                }
            }
            else {
                // If payment method is neither online nor cash on delivery, return an error
                return res.status(400).json({
                    success: false,
                    message: 'Invalid payment method',
                });
            }
            // Create new order
            const newOrder = yield Order_1.default.create({
                user: userid,
                product: order.product,
                fullname,
                email,
                shippingAddress,
                city,
                state,
                postalCode,
                country,
                phoneNumber,
                payment,
                quantity,
                amount
            });
            // Update coupon status if provided
            if (cuponid) {
                yield Cupon_1.default.findByIdAndUpdate(cuponid, { Status: true });
            }
            if (newOrder) {
                // Clear cart after processing orders
                yield Cart_1.default.deleteMany();
                const products = yield Products_1.default.findById(newOrder.product);
                const users = yield User_1.default.findById(userid);
                const email = (users === null || users === void 0 ? void 0 : users.email) || 'talariramcharan33@gmail.com';
                const product = {
                    productname: (products === null || products === void 0 ? void 0 : products.productname) || '',
                    Price: (products === null || products === void 0 ? void 0 : products.Price) || 0,
                    Status: 'Processing'
                };
                // product: { productname: string; Price: number; Status: string })
                (0, Sendmail_1.orderConfirm)(email, product);
                return res.status(201).json({
                    success: true,
                    message: 'Orders placed successfully'
                });
            }
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}));
//user get the orders
router.get('/order/:userid', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.params.userid;
    try {
        const user = yield User_1.default.findById(userid);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "no users found with this id"
            });
        }
        const orders = yield Order_1.default.aggregate([
            {
                $match: {
                    user: new mongoose_1.default.Types.ObjectId(userid),
                }
            },
            {
                $lookup: {
                    from: Products_1.default.collection.name,
                    localField: "product",
                    foreignField: "_id",
                    as: "products"
                }
            }
        ]);
        console.log(orders);
        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "no orders found"
            });
        }
        else {
            return res.status(200).json({
                success: true,
                order: orders
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
//get the delivery order
router.get('/order/:userid', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.params.userid;
    try {
        const user = yield User_1.default.findById(userid);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "no users found with this id"
            });
        }
        const orders = yield Order_1.default.aggregate([
            {
                $match: {
                    user: new mongoose_1.default.Types.ObjectId(userid),
                }
            },
            {
                $match: {
                    Status: { $in: ["deliverd"] }
                }
            },
            {
                $lookup: {
                    from: Products_1.default.collection.name,
                    localField: "product",
                    foreignField: "_id",
                    as: "products"
                }
            }
        ]);
        console.log(orders);
        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "no orders found"
            });
        }
        else {
            return res.status(200).json({
                success: true,
                order: orders
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
//give feeback
router.post('/feedback/:userid/:productid/:orderid', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.params.userid;
    const productid = req.params.productid;
    const orderid = req.params.orderid;
    try {
        const order = yield Order_1.default.findOne({ user: userid, product: productid });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "No order found"
            });
        }
        const { rating, feedback } = req.body;
        let product = yield Products_1.default.findById(productid);
        if (!product) {
            return res.status(400).json({
                success: false,
                message: "No Product Found With This id"
            });
        }
        const alreadyFeedback = yield Products_1.default.findOne({ 'review.order': orderid, 'review.user': userid });
        if (alreadyFeedback) {
            return res.status(400).json({
                success: false,
                message: "Feedback Already Submitted"
            });
        }
        product.review.push({
            user: userid,
            order: orderid,
            rating: rating,
            comment: feedback,
            date: Date.now()
        });
        yield product.save();
        return res.status(201).json({
            success: true,
            message: "Feedback sent successfully",
            feedback: feedback,
            product: product
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
//home pages
router.get('/home', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Products = yield Products_1.default.aggregate([
            {
                $match: {
                    category: "Clothing and Apparel"
                }
            },
            {
                $limit: 4
            }, {
                $sort: {
                    Price: 1
                }
            }
        ]);
        console.log(Products);
        return res.status(200).json({
            success: true,
            Products: Products
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
//get best selling sports 
router.get("/sports", (Req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Products = yield Products_1.default.aggregate([
            {
                $match: {
                    category: "Sports and Outdoors"
                }
            },
            {
                $limit: 4
            }, {
                $sort: {
                    Price: 1
                }
            }
        ]);
        console.log(Products);
        return res.status(200).json({
            success: true,
            Products: Products
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "internla server error"
        });
    }
}));
// get the best selling Jewelry and Accessories
router.get("/Jewelry", (Req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Products = yield Products_1.default.aggregate([
            {
                $match: {
                    category: "Jewelry and Accessories"
                }
            },
            {
                $limit: 4
            }, {
                $sort: {
                    Price: 1
                }
            }
        ]);
        console.log(Products);
        return res.status(200).json({
            success: true,
            Products: Products
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "internla server error"
        });
    }
}));
router.get("/cuopncode", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    }
}));
exports.default = router;
