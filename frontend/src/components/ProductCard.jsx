import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { Link, useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  // Check if product is already in wishlist
  const isInWishlist = wishlist?.some((item) => item._id === product._id);

  const handleWishlistClick = (e) => {
    e.stopPropagation(); // Prevent card navigation
    if (isInWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border-none shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden relative transform hover:-translate-y-1 cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative overflow-hidden h-80 sm:h-96 w-full bg-[#f9f9f9] flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md z-10 transition-all duration-300
            ${isInWishlist ? "text-red-500 scale-110" : "text-gray-400 hover:text-red-500 hover:scale-110"}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={isInWishlist ? "currentColor" : "none"} stroke="currentColor">
            {/* If in wishlist, fill heart. If not, just outline stroke */}
            {isInWishlist ? (
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            )}
          </svg>
        </button>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>

      {/* Product Details */}
      <div className="p-6 text-center">
        <h3 className="font-serif text-xl text-[#2c3e50] mb-2 truncate">
          {product.name}
        </h3>

        {/* Price */}
        <p className="font-light text-[#1a1a1a] text-lg tracking-wide mb-3">
          ₹{product.price}
        </p>

        {/* Rating */}
        <div className="flex items-center justify-center gap-1 text-yellow-400 text-xs mb-4">
          {"★".repeat(Math.ceil(product.rating || 0))}
          <span className="text-gray-400 ml-1">({product.rating})</span>
        </div>

        {/* View Details Link (Text only) */}
        <span className="inline-block text-xs uppercase tracking-widest text-gray-500 border-b border-transparent group-hover:border-gray-500 transition-all pb-1">
          View Details
        </span>
      </div>
    </div>
  );
}










