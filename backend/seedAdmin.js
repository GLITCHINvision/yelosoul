import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/userModel.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.updateOne(
      { email: "admin@yelosoul.com" },
      {
        $set: {
          password: hashedPassword,
          isAdmin: true,
        },
      },
      { upsert: true }
    );

    console.log(" Admin password updated successfully!");
    process.exit();
  } catch (err) {
    console.error(" Error seeding admin:", err);
    process.exit(1);
  }
};

seedAdmin();
