
import mongoose from "mongoose";
import dotenv from "dotenv";
import Occasion from "./models/occasionModel.js";
import Product from "./models/productModel.js";

dotenv.config();

const migrateProducts = async () => {
  try {
    console.log(" MongoDB Connected for Migration");

    const occasions = await Occasion.find();

    for (const occasion of occasions) {
      
      if (!Array.isArray(occasion.products) || occasion.products.length === 0) {
        console.log(` Skipping ${occasion.name} (no products)`);
        continue;
      }

      
      if (typeof occasion.products[0] === "object" && occasion.products[0]._id) {
        console.log(` Skipping ${occasion.name} (already migrated)`);
        continue;
      }

      console.log(` Migrating products for: ${occasion.name}`);

      
      const insertedProducts = await Product.insertMany(
        occasion.products.map((p) => ({
          name: p.name,
          price: p.price,
          image: p.image,
          occasion: occasion._id,
        }))
      );

      
      occasion.products = insertedProducts.map((p) => p._id);
      await occasion.save();

      console.log(` Migrated ${insertedProducts.length} products for: ${occasion.name}`);
    }

    console.log(" Migration completed successfully!");
    process.exit();
  } catch (error) {
    console.error(" Migration failed:", error);
    process.exit(1);
  }
};

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => migrateProducts())
  .catch((err) => console.error(" MongoDB Connection Failed:", err));


