import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="group bg-white rounded-xl border border-[#eaeaea] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
      {/*  Discount Badge */}
      {product.discount && (
        <span className="absolute top-3 left-3 bg-[#fef3e6] text-[#4a8577] text-xs font-bold px-2 py-1 rounded">
          {product.discount}% OFF
        </span>
      )}

      {/*  Product Image */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-xl"
        />
        <button
          onClick={() => {
            addToWishlist(product);
            setIsWishlisted(true);
          }}
          className={`absolute top-3 right-3 bg-white border border-[#eaeaea] rounded-full p-2 shadow-sm
            ${isWishlisted ? "text-red-500" : "text-gray-400"}
            hover:scale-110 hover:text-red-500 transition`}
        >
          ❤️
        </button>
      </div>

      {/*  Product Details */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-[#4a8577] truncate">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mt-1">{product.description}</p>

        {/*  Price */}
        <p className="font-bold text-[#4a8577] text-lg mt-2">₹{product.price}</p>

        {/*  Rating */}
        <div className="flex items-center text-yellow-500 text-sm mt-1">
          {"★".repeat(Math.floor(product.rating))}
          <span className="ml-1 text-gray-500">({product.rating})</span>
        </div>

        {/*  Buttons */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => addToCart(product)}
            className="flex-1 bg-[#e3f2f1] text-[#4a8577] px-3 py-2 rounded-md hover:bg-[#d1ebe8] transition"
          >
            🛒 Add to Cart
          </button>
          <Link
            to={`/product/${product._id}`}
            className="flex-1 text-center border border-[#eaeaea] bg-white rounded-md px-3 py-2 text-[#4a8577] hover:bg-[#f9f9f9] transition"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}










