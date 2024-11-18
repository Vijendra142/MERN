import express, { json, urlencoded } from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import Admin from "./controllers/Admin";
import Users from "./controllers/User";

const app = express();
const PORT = parseInt(process.env.PORT || "6800");
app.use(
  cors({
    origin:  "http://localhost:5173", 
    credentials: true, 
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/products", express.static("products"));
app.use("/users", express.static("users"));

mongoose
  .connect(process.env.DB_URL || "mongodb://localhost:27017/ecom")
  .then(() => {
    console.log("mongodb is connected");
    app.listen(PORT, () => {
      console.log(`server is running the ${PORT}`);
    });
  });

app.use("/admin", Admin);
app.use("/user", Users);
