import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 1000 ? 0 : 99; // Example logic: Free shipping over 1000
  const total = subtotal + shipping;

  const handleProceed = () => {
    if (cart.length === 0) return;
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#fcfbf8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif text-[#2c3e50] mb-8 text-center md:text-left">
          Shopping Bag <span className="text-gray-400 text-lg font-sans font-normal ml-2">({cart.length} items)</span>
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="mb-6">
              <span className="text-6xl">🛍️</span>
            </div>
            <h2 className="text-2xl font-serif text-[#2c3e50] mb-3">Your bag is empty</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Looks like you haven't added any pieces yet. Explore our latest collections to find something special.
            </p>
            <Link
              to="/"
              className="inline-block bg-[#2c3e50] text-white px-8 py-3 rounded-full hover:bg-[#1a252f] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Cart Items Column */}
            <div className="lg:col-span-8 space-y-6">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="group flex flex-col sm:flex-row items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition-all duration-300"
                >
                  {/* Image */}
                  <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden mb-4 sm:mb-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 sm:ml-6 text-center sm:text-left w-full">
                    <div className="flex flex-col sm:flex-row justify-between items-start">
                      <div>
                        <h3 className="font-serif text-lg text-[#2c3e50]">{item.name}</h3>
                        <p className="text-gray-400 text-sm mt-1">{item.category || "Jewelry"}</p>
                      </div>
                      <p className="font-medium text-[#2c3e50] text-lg mt-2 sm:mt-0">
                        ₹{item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      {/* Quantity */}
                      <div className="flex items-center bg-gray-50 rounded-full px-4 py-1 border border-gray-100">
                        <button
                          onClick={() =>
                            item.quantity > 1 &&
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          className="text-gray-400 hover:text-[#2c3e50] px-2 transition-colors font-medium text-lg"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-medium text-[#2c3e50] text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          className="text-gray-400 hover:text-[#2c3e50] px-2 transition-colors font-medium text-lg"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-xs text-red-500/70 hover:text-red-600 uppercase tracking-wider font-semibold hover:underline transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Column */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50 sticky top-24">
                <h2 className="text-xl font-serif text-[#2c3e50] mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-gray-400 italic">Free shipping on orders over ₹1000</p>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-6 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-[#2c3e50] font-medium">Total</span>
                    <span className="text-2xl font-serif text-[#2c3e50]">₹{total.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Including GST</p>
                </div>

                <button
                  onClick={handleProceed}
                  className="w-full bg-[#2c3e50] text-white py-4 rounded-xl hover:bg-[#1a252f] transition-all duration-300 shadow-lg hover:shadow-xl font-medium tracking-wide"
                >
                  Proceed to Checkout
                </button>

                <div className="mt-6 text-center">
                  <Link to="/" className="text-sm text-gray-400 hover:text-[#2c3e50] transition-colors hover:underline">
                    Continue Shopping
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-3 gap-4 text-center text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                  <div>
                    <span className="block text-xl mb-1">🔒</span>
                    Secure
                  </div>
                  <div>
                    <span className="block text-xl mb-1">📦</span>
                    Fast
                  </div>
                  <div>
                    <span className="block text-xl mb-1">💎</span>
                    Quality
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
