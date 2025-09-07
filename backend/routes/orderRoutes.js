import express from "express";
import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  createOrder,     //  Razorpay Payment Initiation
  verifyPayment,   //  Razorpay Payment Verification
} from "../controllers/orderController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();


//  1. Create Razorpay Order (Payment Initiation)
router.post("/payment", protect, createOrder);  

// 2. Verify Razorpay Payment (After frontend success) cool,,,,,,,,,
router.post("/payment/verify", protect, verifyPayment);


//  3. Place a new order (COD or Paid)
router.post("/", protect, placeOrder);

//  4. Get logged-in user's orders
router.get("/my-orders", protect, getMyOrders);

//  5. Get a single order by ID
router.get("/:id", protect, getOrderById);


//  6. Get all orders (Admin only)
router.get("/", protect, admin, getAllOrders);

//  7. Update order status (Admin only)..............................
router.put("/:id/status", protect, admin, updateOrderStatus);

export default router;










