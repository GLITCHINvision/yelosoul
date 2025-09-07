import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";
import { body } from "express-validator";
import { validateRequest } from "../middleware/validateMiddleware.js";

const router = express.Router();

const cartValidation = [
  body("productId").notEmpty().withMessage("Product ID is required"),
  body("quantity").isNumeric().withMessage("Quantity must be a number"),
];

router.get("/", protect, getCart);
router.post("/", protect, cartValidation, validateRequest, addToCart);
router.delete("/:productId", protect, removeFromCart);

export default router;
