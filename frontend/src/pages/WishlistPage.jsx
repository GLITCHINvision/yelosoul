import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { FaTrash, FaShoppingCart } from "react-icons/fa";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-[#fcfbf8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-serif text-[#2c3e50] mb-2">My Wishlist</h1>
            <p className="text-gray-500">Your saved favorites</p>
          </div>
          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-sm text-red-400 hover:text-red-600 underline"
            >
              Clear All
            </button>
          )}
        </div>


        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="text-6xl mb-4 grayscale opacity-50">💖</div>
            <h2 className="text-xl font-serif text-[#2c3e50] mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Save items you love here for later. Start exploring our collections to find your favorites.
            </p>
            <Link
              to="/"
              className="inline-block bg-[#2c3e50] text-white px-8 py-3 rounded-xl hover:bg-[#1a252f] transition-all shadow-md"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlist.map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-4 shadow-sm border border-gray-50 hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm"
                    title="Remove"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>

                <div className="flex-1 flex flex-col">
                  <h3 className="font-serif text-lg text-[#2c3e50] mb-1 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3">
                    {item.description ? (item.description.length > 50 ? item.description.substring(0, 50) + "..." : item.description) : "Elegant jewelry piece"}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="font-medium text-[#2c3e50]">₹{item.price}</span>
                    <button
                      onClick={() => {
                        addToCart(item);
                        removeFromWishlist(index);
                      }}
                      className="flex items-center gap-2 bg-[#2c3e50] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#1a252f] transition-colors"
                    >
                      <FaShoppingCart size={12} />
                      Move to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
