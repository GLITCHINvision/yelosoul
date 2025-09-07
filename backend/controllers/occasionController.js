
import asyncHandler from "express-async-handler";
import Occasion from "../models/occasionModel.js";
import Product from "../models/productModel.js";

//  Add New Occasion (Admin Only)
export const addOccasion = asyncHandler(async (req, res) => {
  const { name, description, image } = req.body;

  if (!name || !description) {
    res.status(400);
    throw new Error(" Name and description are required");
  }

  const occasion = await Occasion.create({
    name: name.trim(),
    description: description.trim(),
    image: image || "",
  });

  res.status(201).json({
    success: true,
    message: " Occasion created successfully",
    occasion,
  });
});

// Get All Occasions (Auto-sync with Products)...............
export const getOccasions = asyncHandler(async (req, res) => {
  const occasions = await Occasion.find().sort({ createdAt: -1 });

  const occasionsWithProducts = await Promise.all(
    occasions.map(async (occasion) => {
      const products = await Product.find(
        { occasion: occasion._id },
        "name price image"
      );
      return {
        _id: occasion._id,
        name: occasion.name,
        description: occasion.description,
        image: occasion.image,
        products,
      };
    })
  );

  res.json({ success: true, occasions: occasionsWithProducts });
});

// Get Single Occasion by ID (Auto-sync).......................
export const getOccasionById = asyncHandler(async (req, res) => {
  const occasion = await Occasion.findById(req.params.id);

  if (!occasion) {
    res.status(404);
    throw new Error(" Occasion not found");
  }

  const products = await Product.find(
    { occasion: occasion._id },
    "name price image description"
  );

  res.json({
    success: true,
    occasion: { ...occasion._doc, products },
  });
});

// bAdd Products to Occasion (Admin Only, Auto-link)
export const addProductToOccasion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { products } = req.body; // Expects [{ name, price, image }]

  if (!Array.isArray(products) || products.length === 0) {
    res.status(400);
    throw new Error(" Products array is required");
  }

  const occasion = await Occasion.findById(id);
  if (!occasion) {
    res.status(404);
    throw new Error(" Occasion not found");
  }

  await Product.insertMany(
    products.map((p) => ({
      ...p,
      occasion: id,
    }))
  );

  const updatedProducts = await Product.find(
    { occasion: id },
    "name price image"
  );

  res.json({
    success: true,
    message: " Products added successfully",
    occasion: {
      _id: occasion._id,
      name: occasion.name,
      description: occasion.description,
      image: occasion.image,
      products: updatedProducts,
    },
  });
});

//  Update Product inside an Occasion
export const updateOccasionProduct = asyncHandler(async (req, res) => {
  const { occasionId, productId } = req.params;
  const { name, price, image, description } = req.body;

  const product = await Product.findOne({
    _id: productId,
    occasion: occasionId,
  });

  if (!product) {
    res.status(404);
    throw new Error(" Product not found in this occasion");
  }

  if (name) product.name = name.trim();
  if (price) product.price = price;
  if (image) product.image = image.trim();
  if (description) product.description = description.trim();

  await product.save();

  res.json({
    success: true,
    message: " Product updated successfully",
    product,
  });
});

//  Delete Product from an Occasion
export const deleteOccasionProduct = asyncHandler(async (req, res) => {
  const { occasionId, productId } = req.params;

  const product = await Product.findOne({
    _id: productId,
    occasion: occasionId,
  });

  if (!product) {
    res.status(404);
    throw new Error(" Product not found in this occasion");
  }

  await product.deleteOne();

  res.json({
    success: true,
    message: " Product deleted successfully",
  });
});

// Delete Occasion (Admin Only)
export const deleteOccasion = asyncHandler(async (req, res) => {
  const occasion = await Occasion.findById(req.params.id);
  if (!occasion) {
    res.status(404);
    throw new Error(" Occasion not found");
  }

  await Product.deleteMany({ occasion: occasion._id });
  await occasion.deleteOne();

  res.json({ success: true, message: " Occasion deleted successfully" });
});

//  Get Products By Occasion Name
export const getProductsByOccasionName = asyncHandler(async (req, res) => {
  const { name } = req.params;

  const occasion = await Occasion.findOne({ name: new RegExp(`^${name}$`, "i") });
  if (!occasion) {
    res.status(404);
    throw new Error(" Occasion not found");
  }

  const products = await Product.find(
    { occasion: occasion._id },
    "name price image description"
  );

  res.json({
    success: true,
    occasionName: occasion.name,
    products,
  });
});



