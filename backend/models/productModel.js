import mongoose from "mongoose";

// Review sub-schema
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Product schema
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: { type: String, default: "" },

    
    image: { type: String, default: "" },

    
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.every((url) => typeof url === "string" && url.trim() !== "");
        },
        message: "All image URLs must be non-empty strings",
      },
    },

    price: { type: Number, required: true, default: 0 },

  
    stock: { type: Number, default: 0 },

  
    reviews: { type: [reviewSchema], default: [] },
    numReviews: { type: Number, default: 0 },
    rating: { type: Number, default: 0 }, // average rating

    occasion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Occasion",
    },
  },
  { timestamps: true }
);


productSchema.methods.recalculateRating = function () {
  this.numReviews = this.reviews.length;
  if (this.numReviews === 0) {
    this.rating = 0;
  } else {
    const avg =
      this.reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0) / this.numReviews;
    this.rating = Math.round(avg * 10) / 10; // round to 1 decimal
  }
};

const Product = mongoose.model("Product", productSchema);
export default Product;
