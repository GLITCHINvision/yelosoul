import express from "express";
import {
  addOccasion,
  getOccasions,
  getOccasionById,
  addProductToOccasion,
  updateOccasionProduct,
  deleteOccasionProduct,
  deleteOccasion,
  getProductsByOccasionName,
} from "../controllers/occasionController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

//  Public Routes (Customers)
router.get("/", getOccasions); // Get all occasions
router.get("/name/:name", getProductsByOccasionName); // Get products by occasion name
router.get("/:id", getOccasionById); // Get occasion by ID

// Admin Routes
router.post("/", protect, admin, addOccasion); // Add occasion
router.post("/:id/products", protect, admin, addProductToOccasion); // Add products to an occasion
router.patch("/:occasionId/products/:productId", protect, admin, updateOccasionProduct); //  Update a product
router.delete("/:occasionId/products/:productId", protect, admin, deleteOccasionProduct); // Delete a product
router.delete("/:id", protect, admin, deleteOccasion); // Delete entire occasion

export default router;





