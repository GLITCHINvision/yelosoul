import express from "express";
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addProductReview,
  deleteProductReview,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { body } from "express-validator";
import { validateRequest } from "../middleware/validateMiddleware.js";

const router = express.Router();

//Product validation rules
const productValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("stock").isNumeric().withMessage("Stock must be a number"),
];

/* -------------------- PUBLIC ROUTES -------------------- */
router.get("/", getProducts); // Get all products (with filters, pagination, sorting)
router.get("/:id", getProductById); // Get single product (with reviews)

/* -------------------- REVIEWS -------------------- */
router.post("/:id/reviews", protect, addProductReview); // Add review (logged in users)
router.delete("/:id/reviews/:reviewId", protect, deleteProductReview); // Delete review (only by review author)

/* -------------------- ADMIN PRODUCT CRUD -------------------- */
router.post("/", protect, admin, productValidation, validateRequest, addProduct); // Add new product
router.put("/:id", protect, admin, productValidation, validateRequest, updateProduct); // Update product
router.delete("/:id", protect, admin, deleteProduct); // Delete product

export default router;




