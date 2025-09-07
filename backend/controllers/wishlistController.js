import asyncHandler from "express-async-handler";
import Wishlist from "../models/wishlistModel.js";

// Add Product to Wishlist
export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = new Wishlist({ user: req.user._id, products: [productId] });
  } else {
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
    }
  }

  await wishlist.save();
  res.json({ message: "Product added to wishlist", wishlist });
});

//  Get User Wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    "products"
  );
  res.json(wishlist || { products: [] });
});

// Remove Product from Wishlist
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (wishlist) {
    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== productId
    );
    await wishlist.save();
    res.json({ message: "Product removed from wishlist", wishlist });
  } else {
    res.status(404).json({ message: "Wishlist not found" });
  }
});
