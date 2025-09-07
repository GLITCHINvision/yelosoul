import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/productModel.js";

dotenv.config();

// Random rating generator
const randomRating = () => Math.floor(Math.random() * 5) + 1;

//  Products Array (sample 12, you can add more later)
const products = [
  {
    name: "Elegant Gold Necklace",
    price: 1499,
    category: "necklaces",
    image: "/products/gold-necklace.png",
    discount: 20,
    description: "Stylish gold necklace perfect for parties & daily wear.",
    rating: randomRating(),
  },
  {
    name: "Crystal Stud Earrings",
    price: 899,
    category: "earrings",
    image: "/products/crystal-stud.jpg",
    discount: 10,
    description: "Trendy crystal studs for an elegant look.",
    rating: randomRating(),
  },
  {
    name: "Pearl Bracelet",
    price: 1199,
    category: "bracelets",
    image: "https://via.placeholder.com/300x200?text=Pearl+Bracelet",
    discount: 15,
    description: "Classic pearl bracelet, minimal yet classy.",
    rating: randomRating(),
  },
  {
    name: "Diamond Ring Replica",
    price: 1899,
    category: "rings",
    image: "https://via.placeholder.com/300x200?text=Diamond+Ring",
    discount: 25,
    description: "Luxury diamond replica ring for special occasions.",
    rating: randomRating(),
  },
  {
    name: "Rose Gold Anklet",
    price: 499,
    category: "bracelets",
    image: "https://via.placeholder.com/300x200?text=Rose+Gold+Anklet",
    discount: 5,
    description: "Trendy rose gold anklet loved by Gen Z.",
    rating: randomRating(),
  },
  {
    name: "Emerald Drop Earrings",
    price: 1399,
    category: "earrings",
    image: "https://via.placeholder.com/300x200?text=Emerald+Earrings",
    discount: 18,
    description: "Emerald green drop earrings for a bold statement.",
    rating: randomRating(),
  },
  {
    name: "Royal Choker Necklace",
    price: 2499,
    category: "necklaces",
    image: "https://via.placeholder.com/300x200?text=Choker+Necklace",
    discount: 30,
    description: "Royal-style choker for wedding & festive wear.",
    rating: randomRating(),
  },
  {
    name: "Sapphire Wedding Ring",
    price: 2899,
    category: "rings",
    image: "https://via.placeholder.com/300x200?text=Sapphire+Ring",
    discount: 12,
    description: "Luxury sapphire wedding ring replica.",
    rating: randomRating(),
  },
  {
    name: "Luxury Bridal Set",
    price: 5200,
    category: "necklaces",
    image: "https://via.placeholder.com/300x200?text=Bridal+Set",
    discount: 35,
    description: "Complete bridal set for wedding functions.",
    rating: randomRating(),
  },
  {
    name: "Minimalist Silver Band",
    price: 399,
    category: "rings",
    image: "https://via.placeholder.com/300x200?text=Silver+Band",
    discount: 5,
    description: "Simple silver band for daily wear.",
    rating: randomRating(),
  },
  {
    name: "Vintage Charm Bracelet",
    price: 999,
    category: "bracelets",
    image: "https://via.placeholder.com/300x200?text=Charm+Bracelet",
    discount: 15,
    description: "Vintage-style charm bracelet with multiple charms.",
    rating: randomRating(),
  },
  {
    name: "Studded Hoops",
    price: 749,
    category: "earrings",
    image: "https://via.placeholder.com/300x200?text=Studded+Hoops",
    discount: 8,
    description: "Trendy studded hoops for a cool street-style vibe.",
    rating: randomRating(),
  },
];

//  Import Seeder Function
const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Product.deleteMany(); //  Clears old products first (optional)
    await Product.insertMany(products);

    console.log(" Products Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error(" Error:", error);
    process.exit(1);
  }
};

importData();

