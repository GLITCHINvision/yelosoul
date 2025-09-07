import mongoose from "mongoose";
import dotenv from "dotenv";
import Occasion from "./models/occasionModel.js";
import Product from "./models/productModel.js";

dotenv.config();

const migrateProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" MongoDB Connected");

    const occasions = await Occasion.find();
    for (let occasion of occasions) {
      // If products are already ObjectId, skip migration
      if (
        occasion.products.length > 0 &&
        typeof occasion.products[0] === "object" &&
        !occasion.products[0]._id
      ) {
        console.log(`Migrating products for: ${occasion.name}`);

        const createdProducts = await Product.insertMany(
          occasion.products.map((p) => ({
            name: p.name,
            price: p.price,
            image: p.image,
            occasion: occasion._id,
          }))
        );

        occasion.products = createdProducts.map((p) => p._id);
        await occasion.save();
      }
    }

    console.log(" Migration completed");
    process.exit();
  } catch (error) {
    console.error(" Migration failed:", error);
    process.exit(1);
  }
};

migrateProducts();

