// src/utils/sendOtpRegister.ts
import nodemailer, { createTransport } from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export const sendotpregister = async (email: string, otp: string): Promise<void> => {
  // Create a transporter using SMTP with your email service configuration
  const transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'cse.takeoff@gmail.com', // Your email address
      pass: process.env.EMAIL_PASS || 'digkagfgyxcjltup', // Your email password or app-specific password
    },
  });

  // Verify the transporter configuration
  try {
    await transporter.verify();
    console.log('Server is ready to take our messages');
  } catch (error) {
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
  const mailOptions: MailOptions = {
    from: `"ShopSmart" <${process.env.EMAIL_USER || 'cse.takeoff@gmail.com'}>`, // sender address
    to: email, // recipient address
    subject: 'Verify Your OTP', // subject line
    html: htmlContent, // html body
  };

  try {
    // Send mail with defined transport object
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
  } catch (error: any) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};


export const sendOrderStatusChange = async (email: any, product: { productname: string, Price: number, Status: string }) => {
  // Create a transporter using SMTP with your email service configuration
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'cse.takeoff@gmail.com', // Your email address
      pass: process.env.EMAIL_PASS || 'digkagfgyxcjltup', 
    },
  });

  // Verify the transporter configuration
  try {
    await transporter.verify();
    console.log('Server is ready to send emails');
  } catch (error) {
    console.error('Error verifying transporter:', error);
    throw new Error('Failed to configure email transporter');
  }

  console.log(email,"email");

  console.log(product,"products")

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
    await transporter.sendMail(mailOptions);
    console.log('Order status email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send order status email');
  }
};



export const orderConfirm = async (email: string, product: { productname: string; Price: number; Status: string }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'cse.takeoff@gmail.com', // Your email address
      pass: process.env.EMAIL_PASS || 'digkagfgyxcjltup', // Your email password or app-specific password
    },
  });

  // Verify transporter configuration
  try {
    await transporter.verify();
    console.log('Server is ready to send emails');
  } catch (error) {
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
    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send order confirmation email');
  }
};







  
















