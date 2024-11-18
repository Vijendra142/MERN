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
exports.orderConfirm = exports.sendOrderStatusChange = exports.sendotpregister = void 0;
// src/utils/sendOtpRegister.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
const sendotpregister = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    // Create a transporter using SMTP with your email service configuration
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'cse.takeoff@gmail.com', // Your email address
            pass: process.env.EMAIL_PASS || 'digkagfgyxcjltup', // Your email password or app-specific password
        },
    });
    // Verify the transporter configuration
    try {
        yield transporter.verify();
        console.log('Server is ready to take our messages');
    }
    catch (error) {
        console.error('Error verifying transporter:', error);
        throw new Error('Failed to configure email transporter');
    }
    // Define the HTML content of the email
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="background-color: #4CAF50; color: white; padding: 15px; text-align: center; border-radius: 5px;">
        <h2>Verify Your OTP</h2>
      </div>
      <div style="background-color: white; padding: 20px; margin-top: 10px; border-radius: 5px;">
        <p>Dear User,</p>
        <p>Thank you for registering with <strong>ShopSmart</strong>. Please use the following One-Time Password (OTP) to verify your email address:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; color: #333;">${otp}</span>
        </div>
        <p>If you did not initiate this request, please ignore this email.</p>
        <p>Best regards,<br/>ShopSmart Team</p>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #777;">
        <p>&copy; ${new Date().getFullYear()} ShopSmart. All rights reserved.</p>
      </div>
    </div>
  `;
    // Define mail options
    const mailOptions = {
        from: `"ShopSmart" <${process.env.EMAIL_USER || 'cse.takeoff@gmail.com'}>`, // sender address
        to: email, // recipient address
        subject: 'Verify Your OTP', // subject line
        html: htmlContent, // html body
    };
    try {
        // Send mail with defined transport object
        const info = yield transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
    }
    catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email');
    }
});
exports.sendotpregister = sendotpregister;
const sendOrderStatusChange = (email, product) => __awaiter(void 0, void 0, void 0, function* () {
    // Create a transporter using SMTP with your email service configuration
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'cse.takeoff@gmail.com', // Your email address
            pass: process.env.EMAIL_PASS || 'digkagfgyxcjltup',
        },
    });
    // Verify the transporter configuration
    try {
        yield transporter.verify();
        console.log('Server is ready to send emails');
    }
    catch (error) {
        console.error('Error verifying transporter:', error);
        throw new Error('Failed to configure email transporter');
    }
    console.log(email, "email");
    console.log(product, "products");
    // Define the HTML content of the email
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="background-color: #4CAF50; color: white; padding: 15px; text-align: center; border-radius: 5px;">
        <h2>Order Status Update</h2>
      </div>
      <div style="background-color: white; padding: 20px; margin-top: 10px; border-radius: 5px;">
        <p>Dear Customer,</p>
        <p>Your order for the product <strong>${product.productname}</strong> has been updated. Please find the order details below:</p>
        <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
          <tr>
            <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">Product Name</th>
            <td style="padding: 8px;">${product.productname}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">Price</th>
            <td style="padding: 8px;">$${product.Price.toFixed(2)}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">Status</th>
            <td style="padding: 8px;">${product.Status}</td>
          </tr>
        </table>
        <p>If you have any questions about your order, please don't hesitate to contact us.</p>
        <p>Best regards,<br/>ShopSmart Team</p>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #777;">
        <p>&copy; ${new Date().getFullYear()} ShopSmart. All rights reserved.</p>
      </div>
    </div>
  `;
    // Define mail options
    const mailOptions = {
        from: 'ShopSmart <cse.takeoff@gmail.com>', // Sender email
        to: email, // Recipient email
        subject: 'Your Order Status Update', // Email subject
        html: htmlContent, // Email content in HTML format
    };
    // Send email
    try {
        yield transporter.sendMail(mailOptions);
        console.log('Order status email sent successfully');
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send order status email');
    }
});
exports.sendOrderStatusChange = sendOrderStatusChange;
const orderConfirm = (email, product) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'cse.takeoff@gmail.com', // Your email address
            pass: process.env.EMAIL_PASS || 'digkagfgyxcjltup', // Your email password or app-specific password
        },
    });
    // Verify transporter configuration
    try {
        yield transporter.verify();
        console.log('Server is ready to send emails');
    }
    catch (error) {
        console.error('Error verifying transporter:', error);
        throw new Error('Failed to configure email transporter');
    }
    // Define HTML content for the order confirmation email
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="background-color: #4CAF50; color: white; padding: 15px; text-align: center; border-radius: 5px;">
        <h2>Order Confirmation</h2>
      </div>
      <div style="background-color: white; padding: 20px; margin-top: 10px; border-radius: 5px;">
        <p>Dear Customer,</p>
        <p>Your order for the product <strong>${product.productname}</strong> has been confirmed. Please find the order details below:</p>
        <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
          <tr>
            <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">Product Name</th>
            <td style="padding: 8px;">${product.productname}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">Price</th>
            <td style="padding: 8px;">$${product.Price.toFixed(2)}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">Status</th>
            <td style="padding: 8px;">${product.Status}</td>
          </tr>
        </table>
        <p>If you have any questions about your order, please don't hesitate to contact us.</p>
        <p>Best regards,<br/>ShopSmart Team</p>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #777;">
        <p>&copy; ${new Date().getFullYear()} ShopSmart. All rights reserved.</p>
      </div>
    </div>
  `;
    // Define email options
    const mailOptions = {
        from: 'ShopSmart <cse.takeoff@gmail.com>', // Sender email
        to: email, // Recipient email
        subject: 'Your Order Confirmation', // Email subject
        html: htmlContent, // Email content in HTML format
    };
    // Send email
    try {
        yield transporter.sendMail(mailOptions);
        console.log('Order confirmation email sent successfully');
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send order confirmation email');
    }
});
exports.orderConfirm = orderConfirm;
