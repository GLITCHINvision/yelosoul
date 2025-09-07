import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleProceed = () => {
    if (cart.length === 0) {
      navigate("/"); // Redirect to home if empty
    } else {
      navigate("/checkout"); // Go to checkout page
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center bg-white p-6 rounded shadow">
          <p className="text-gray-600 mb-4 text-lg">Your cart is empty.</p>
          <button
            onClick={handleProceed}
            className="bg-primary text-white px-6 py-2 rounded hover:opacity-90 transition"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 shadow rounded-lg hover:shadow-md transition"
              >
                {/* Product Info */}
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600">
                      ₹{item.price.toFixed(2)}
                    </p>

                    {/*  Quantity Controls */}
                    <div className="flex items-center mt-2 space-x-2">
                      <button
                        onClick={() =>
                          item.quantity > 1 &&
                          updateQuantity(item._id, item.quantity - 1)
                        }
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                      >
                        -
                      </button>
                      <span className="px-3 text-lg font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/*  Remove Button */}
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:underline mt-3 sm:mt-0 text-sm"
                >
                   Remove
                </button>
              </div>
            ))}
          </div>

          {/*  Total & Checkout */}
          <div className="text-right mt-6 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-2">
              Total:{" "}
              <span className="text-green-600">
                ₹{totalPrice.toFixed(2)}
              </span>
            </h2>
            <button
              onClick={handleProceed}
              className="bg-primary text-white py-2 px-6 rounded hover:opacity-90 transition"
            >
               Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}


