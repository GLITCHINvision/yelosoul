import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";

//  Add to Cart
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const itemIndex = user.cart.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    user.cart[itemIndex].quantity += quantity;
  } else {
    user.cart.push({ product: productId, quantity });
  }

  await user.save();
  res.json({ message: "Product added to cart", cart: user.cart });
});

//  Get Cart
export const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate("cart.product");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user.cart);
});

//  Remove from Cart
export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user.id);

  user.cart = user.cart.filter(
    (item) => item.product.toString() !== productId
  );
  await user.save();
  res.json({ message: "Product removed from cart", cart: user.cart });
});

//  Add to Wishlist
export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user.id);

  if (!user.wishlist.includes(productId)) {
    user.wishlist.push(productId);
  }

  await user.save();
  res.json({ message: "Product added to wishlist", wishlist: user.wishlist });
});

//Remove from Wishlist
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user.id);

  user.wishlist = user.wishlist.filter(
    (id) => id.toString() !== productId
  );
  await user.save();
  res.json({ message: "Product removed from wishlist", wishlist: user.wishlist });
});

//  Get Wishlist...........................
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate("wishlist");
  res.json(user.wishlist);
});
