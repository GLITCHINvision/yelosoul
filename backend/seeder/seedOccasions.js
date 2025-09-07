// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import connectDB from "../config/db.js";
// import Occasion from "../models/occasionModel.js";

// dotenv.config();

// const sampleOccasions = [
//   {
//     name: "Birthday Gifts",
//     description: "Surprise your loved ones with special birthday gifts!",
//     image: "https://example.com/birthday.jpg",
//     products: [
//       {
//         name: "Chocolate Cake",
//         price: 499,
//         image: "https://example.com/cake.jpg",
//       },
//       {
//         name: "Teddy Bear",
//         price: 699,
//         image: "https://example.com/teddy.jpg",
//       },
//     ],
//   },
//   {
//     name: "Wedding Gifts",
//     description: "Elegant gifts for newlyweds",
//     image: "https://example.com/wedding.jpg",
//     products: [
//       {
//         name: "Crystal Vase",
//         price: 1999,
//         image: "https://example.com/vase.jpg",
//       },
//       {
//         name: "Couple Photo Frame",
//         price: 899,
//         image: "https://example.com/photo-frame.jpg",
//       },
//     ],
//   },
//   {
//     name: "Anniversary Gifts",
//     description: "Celebrate love with timeless gifts",
//     image: "https://example.com/anniversary.jpg",
//     products: [
//       {
//         name: "Rose Bouquet",
//         price: 499,
//         image: "https://example.com/rose.jpg",
//       },
//       {
//         name: "Couple Rings",
//         price: 1499,
//         image: "https://example.com/rings.jpg",
//       },
//     ],
//   }
// ];

// const importData = async () => {
//   try {
//     await connectDB();
//     await Occasion.deleteMany();
//     await Occasion.insertMany(sampleOccasions);
//     console.log(" Sample occasions inserted!");
//     process.exit();
//   } catch (error) {
//     console.error(" Error seeding data:", error);
//     process.exit(1);
//   }
// };

// importData();
