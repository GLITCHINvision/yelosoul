import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../controllers/wishlistController.js";
import { body } from "express-validator";
import { validateRequest } from "../middleware/validateMiddleware.js";

const router = express.Router();

// Get user's wishlist
router.get("/", protect, getWishlist);

// Add to wishlist (Validation)
router.post(
  "/",
  protect,
  [
    body("productId")
      .notEmpty()
      .withMessage("Product ID is required")
      .isMongoId()
      .withMessage("Invalid Product ID"),
  ],
  validateRequest,
  addToWishlist
);

// Remove from wishlist (Validation)
router.delete(
  "/:id",
  protect,
  [
    body("id").isMongoId().withMessage("Invalid Product ID"),
  ],
  validateRequest,
  removeFromWishlist
);

export default router;

