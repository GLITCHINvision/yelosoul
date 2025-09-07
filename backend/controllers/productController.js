import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

/**
 * 📊 Admin Inventory Stats
 */
export const getInventoryStats = asyncHandler(async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const lowStock = await Product.countDocuments({ stock: { $gt: 0, $lte: 5 } });
  const outOfStock = await Product.countDocuments({ stock: 0 });

  res.json({ totalProducts, lowStock, outOfStock });
});

/**
 * ➕ Add Product (Admin Only)
 */
export const addProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    image,
    images,
    stock,
    category,
    discount,
  } = req.body;

  if (!name || !price || (!image && (!images || images.length === 0))) {
    res.status(400);
    throw new Error("Name, price, and at least one image are required");
  }

  const product = await Product.create({
    name,
    description,
    price,
    image: image || "",
    images: images || [],
    stock: stock || 0,
    category: category || "General",
    discount: discount || 0,
  });

  res.status(201).json(product);
});

/**
 * 📦 Get All Products (Filtering + Sorting + Pagination)
 */
export const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;

  // 🔍 Filters
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const category =
    req.query.category && req.query.category !== "all"
      ? { category: { $regex: req.query.category, $options: "i" } }
      : {};

  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : 100000;
  const priceFilter = { price: { $gte: minPrice, $lte: maxPrice } };

  const bestDealsOnly = req.query.bestDealsOnly === "true";
  const dealsFilter = bestDealsOnly ? { discount: { $gte: 20 } } : {};

  const stockFilter = { stock: { $gt: 0 } };

  // 🔄 Sorting
  let sortBy = {};
  switch (req.query.sort) {
    case "low-high":
      sortBy = { price: 1 };
      break;
    case "high-low":
      sortBy = { price: -1 };
      break;
    case "rating":
      sortBy = { rating: -1 };
      break;
    case "discount":
      sortBy = { discount: -1 };
      break;
    default:
      sortBy = { createdAt: -1 };
  }

  // 📊 Count + Fetch
  const totalProducts = await Product.countDocuments({
    ...keyword,
    ...category,
    ...priceFilter,
    ...dealsFilter,
    ...stockFilter,
  });

  const products = await Product.find({
    ...keyword,
    ...category,
    ...priceFilter,
    ...dealsFilter,
    ...stockFilter,
  })
    .sort(sortBy)
    .limit(limit)
    .skip((page - 1) * limit);

  res.json({
    products,
    page,
    pages: Math.ceil(totalProducts / limit),
    totalProducts,
  });
});

/**
 * 🔍 Get Single Product (with reviews)
 */
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

/**
 * 📝 Add Product Review (Protected — No restriction on number of reviews)
 */
export const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.reviews.unshift({
    user: req.user._id,
    name: req.user.name || "User",
    rating: Number(rating),
    comment: comment?.trim() || "",
  });

  product.recalculateRating();
  await product.save();

  res.status(201).json({
    success: true,
    message: "Review added successfully",
    reviews: product.reviews,
    rating: product.rating,
    numReviews: product.numReviews,
  });
});

/**
 * ❌ Delete Product Review (Protected — Only by Creator)
 */
export const deleteProductReview = asyncHandler(async (req, res) => {
  const { id: productId, reviewId } = req.params;
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const review = product.reviews.find(
    (r) => r._id.toString() === reviewId.toString()
  );

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  if (review.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this review");
  }

  product.reviews = product.reviews.filter(
    (r) => r._id.toString() !== reviewId.toString()
  );

  product.recalculateRating();
  await product.save();

  res.json({
    success: true,
    message: "Review deleted successfully",
    reviews: product.reviews,
    rating: product.rating,
    numReviews: product.numReviews,
  });
});

/**
 * ✏️ Update Product (Admin Only)
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  Object.assign(product, req.body);
  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

/**
 * ❌ Delete Product (Admin Only)
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  await product.deleteOne();
  res.json({ message: "Product deleted successfully" });
});




