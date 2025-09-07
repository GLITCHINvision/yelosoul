import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 bg-[#fafafa] rounded-lg">
      <h2 className="text-3xl font-bold text-[#4a8577] mb-6">💖 Your Wishlist</h2>

      {wishlist.length === 0 ? (
        <p className="text-gray-500">No items in your wishlist.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {wishlist.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-4 border border-[#eaeaea] hover:shadow-md transition"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-md mb-3"
                />
                <h3 className="text-lg font-semibold text-[#4a8577]">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
                <p className="font-bold text-[#4a8577] mt-2">₹{item.price}</p>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      addToCart(item);
                      removeFromWishlist(index);
                    }}
                    className="flex-1 bg-[#e3f2f1] text-[#4a8577] px-3 py-2 rounded-md hover:bg-[#d1ebe8] transition"
                  >
                    🛒 Move to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="flex-1 bg-[#fef3e6] text-[#4a8577] px-3 py-2 rounded-md hover:bg-[#fde2c3] transition"
                  >
                     Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={clearWishlist}
            className="mt-6 bg-[#fef3e6] text-[#4a8577] px-5 py-2 rounded-md hover:bg-[#fde2c3] transition"
          >
            🗑 Clear All
          </button>
        </>
      )}
    </div>
  );
}




