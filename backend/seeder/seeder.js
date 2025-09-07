import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/userModel.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const importData = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@yelosoul.com" });

    if (!adminExists) {
      await User.create({
        name: "Admin",
        email: "admin@yelosoul.com",
        password: bcrypt.hashSync("admin123", 10),
        isAdmin: true,
      });
      console.log(" Admin user created!");
    } else {
      console.log(" Admin already exists");
    }

    process.exit();
  } catch (error) {
    console.error(` Error: ${error}`);
    process.exit(1);
  }
};

importData();
