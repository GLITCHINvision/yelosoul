import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";

// CREATE RAZORPAY ORDER
export const createOrder = asyncHandler(async (req, res) => {
  try {
    const { totalPrice } = req.body;

    if (!totalPrice || totalPrice <= 0) {
      res.status(400);
      throw new Error("Invalid total price");
    }

    // Razorpay instance created after dotenv is loaded
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(totalPrice * 100), // Convert to paise
      currency: "INR",
      receipt: `rcpt_${crypto.randomBytes(6).toString("hex")}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json({
      success: true,
      message: " Razorpay order created successfully",
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error(" Razorpay Order Error:", error);
    res.status(500);
    throw new Error("Failed to create Razorpay order");
  }
});

// VERIFY PAYMENT (After Frontend Payment Success)
export const verifyPayment = asyncHandler(async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400);
      throw new Error("Missing payment verification details");
    }

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      res.status(400);
      throw new Error(" Payment verification failed");
    }

    //  Optional: Update order in DB if orderId is provided
    if (orderId && mongoose.Types.ObjectId.isValid(orderId)) {
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentInfo.status = "Paid";
        order.paymentInfo.transactionId = razorpay_payment_id;
        order.status = "Processing";
        await order.save();
      }
    }

    res.status(200).json({
      success: true,
      message: " Payment verified successfully",
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error(" Payment Verification Error:", error);
    res.status(500);
    throw new Error("Internal payment verification error");
  }
});

// PLACE NEW ORDER (After Payment Confirmation)
export const placeOrder = asyncHandler(async (req, res) => {
  const { orderItems, totalPrice, shippingAddress, paymentInfo } = req.body;

  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items provided");
  }

  if (!totalPrice || isNaN(totalPrice) || totalPrice <= 0) {
    res.status(400);
    throw new Error("Total price must be a valid positive number");
  }

  if (
    !shippingAddress ||
    !shippingAddress.address ||
    !shippingAddress.city ||
    !shippingAddress.postalCode ||
    !shippingAddress.country
  ) {
    res.status(400);
    throw new Error("Complete shipping address is required");
  }

  const safePaymentInfo = {
    method: paymentInfo?.method || "Razorpay",
    status: paymentInfo?.status || "Pending",
    transactionId: paymentInfo?.transactionId || null,
  };

  const formattedOrderItems = orderItems.map((item) => {
    if (!item.product || !mongoose.Types.ObjectId.isValid(item.product)) {
      res.status(400);
      throw new Error(`Invalid product ID for item: ${item.name}`);
    }
    return {
      name: item.name,
      qty: Number(item.qty) || 1,
      price: Number(item.price),
      product: item.product,
    };
  });

  const order = await Order.create({
    user: req.user._id,
    orderItems: formattedOrderItems,
    totalPrice,
    shippingAddress,
    status: "Pending", // Changes to "Processing" after payment verification
    paymentInfo: safePaymentInfo,
  });

  res.status(201).json({
    success: true,
    message: " Order placed successfully",
    order: {
      _id: order._id,
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      paymentInfo: {
        method: safePaymentInfo.method,
        status: safePaymentInfo.status,
      },
    },
  });
});

// GET LOGGED-IN USER ORDERS
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("orderItems.product", "name price image")
    .sort({ createdAt: -1 });

  res.json(
    orders.map((order) => ({
      _id: order._id,
      status: order.status,
      createdAt: order.createdAt,
      totalPrice: order.totalPrice,
      shippingAddress: order.shippingAddress,
      paymentInfo: {
        method: order.paymentInfo?.method,
        status: order.paymentInfo?.status,
      },
      orderItems: order.orderItems.map((item) => ({
        name: item.name || item.product?.name,
        qty: item.qty,
        price: item.price || item.product?.price,
        image: item.product?.image || "",
      })),
    }))
  );
});

// GET ALL ORDERS (ADMIN)
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("orderItems.product", "name price image")
    .sort({ createdAt: -1 });

  res.json(
    orders.map((order) => ({
      _id: order._id,
      user: order.user,
      status: order.status,
      createdAt: order.createdAt,
      totalPrice: order.totalPrice,
      shippingAddress: order.shippingAddress,
      paymentInfo: {
        method: order.paymentInfo?.method,
        status: order.paymentInfo?.status,
      },
      orderItems: order.orderItems,
    }))
  );
});

// GET SINGLE ORDER BY ID
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("orderItems.product", "name price image");

  if (!order) {
    res.status(404);
    throw new Error(" Order not found");
  }

  if (
    order.user._id.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    res.status(403);
    throw new Error(" Not authorized to view this order");
  }

  res.json({
    _id: order._id,
    status: order.status,
    createdAt: order.createdAt,
    totalPrice: order.totalPrice,
    shippingAddress: order.shippingAddress,
    paymentInfo: {
      method: order.paymentInfo?.method,
      status: order.paymentInfo?.status,
    },
    orderItems: order.orderItems,
  });
});

// UPDATE ORDER STATUS (ADMIN)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error(" Invalid status");
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error(" Order not found");
  }

  order.status = status;
  const updatedOrder = await order.save();

  res.json({
    success: true,
    message: ` Order status updated to ${status}`,
    order: {
      _id: updatedOrder._id,
      status: updatedOrder.status,
      totalPrice: updatedOrder.totalPrice,
    },
  });
});












